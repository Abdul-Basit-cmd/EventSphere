import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import notificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";
import { sendRealtimeNotification } from "./realtime.js";

const uniqueIds = (ids) => [
  ...new Set(ids.filter(Boolean).map((id) => id.toString())),
];

export const createNotification = async ({ userId, expoId = null, type, title, message, metadata = {} }) => {
  const notification = await notificationModel.create({
    userId,
    expoId,
    type,
    title,
    message,
    metadata,
  });

  sendRealtimeNotification(userId, notification);
  return notification;
};

export const createNotificationsForUsers = async (userIds, payload) => {
  const recipients = uniqueIds(userIds);
  if (!recipients.length) return [];

  const notifications = await notificationModel.insertMany(
    recipients.map((userId) => ({
      ...payload,
      userId,
    }))
  );

  notifications.forEach((notification) => {
    sendRealtimeNotification(notification.userId, notification);
  });

  return notifications;
};

export const notifyExpoAttendees = async (expoId, payload) => {
  const registrations = await attendeeRegistrationModel.find({ expo: expoId }).select("user");
  return createNotificationsForUsers(
    registrations.map((registration) => registration.user),
    { ...payload, expoId }
  );
};

export const notifyAdmins = async (payload) => {
  const admins = await userModel.find({ role: "admin" }).select("_id");
  return createNotificationsForUsers(
    admins.map((admin) => admin._id),
    payload
  );
};
