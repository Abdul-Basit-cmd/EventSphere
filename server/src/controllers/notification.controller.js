import notificationModel from "../models/notification.model.js";
import { subscribeToNotifications } from "../utils/realtime.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const query = { userId };

    if (req.query.unread === "true") {
      query.readAt = null;
    }

    const [total, notifications, unreadCount] = await Promise.all([
      notificationModel.countDocuments(query),
      notificationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      notificationModel.countDocuments({ userId, readAt: null }),
    ]);

    return res.status(200).json({
      status: "Ok",
      data: {
        notifications,
        unreadCount,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await notificationModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ status: "Fail", message: "Notification not found" });
    }

    return res.status(200).json({ status: "Ok", data: { notification } });
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { userId: req.user.userId, readAt: null },
      { readAt: new Date() }
    );

    return res.status(200).json({ status: "Ok", message: "Notifications marked as read" });
  } catch (error) {
    console.error("Mark All Notifications Read Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const streamNotifications = (req, res) => {
  subscribeToNotifications(req.user.userId, res);
};
