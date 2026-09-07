import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import notificationModel from "../models/notification.model.js";
import scheduleModel from "../models/schedule.model.js";
import { createNotification } from "./notifications.js";

const REMINDER_WINDOW_MINUTES = 30;
const CHECK_INTERVAL_MS = 60 * 1000;

let schedulerStarted = false;
let checkInProgress = false;

export const runSessionReminderCheck = async () => {
  if (checkInProgress) return;
  checkInProgress = true;

  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MINUTES * 60 * 1000);
    const sessions = await scheduleModel
      .find({ startTime: { $gte: now, $lte: windowEnd } })
      .select("topic expoId startTime location");

    for (const session of sessions) {
      const registrations = await attendeeRegistrationModel
        .find({ bookmarkedSessions: session._id })
        .select("user expo");

      for (const registration of registrations) {
        const existingReminder = await notificationModel.findOne({
          userId: registration.user,
          type: "schedule_reminder",
          "metadata.reminderKind": "upcoming",
          "metadata.sessionId": session._id,
        });

        if (existingReminder) continue;

        await createNotification({
          userId: registration.user,
          expoId: registration.expo,
          type: "schedule_reminder",
          title: "Upcoming session reminder",
          message: `${session.topic} starts at ${session.startTime.toLocaleString()}.`,
          metadata: {
            reminderKind: "upcoming",
            sessionId: session._id,
            startTime: session.startTime,
            location: session.location,
          },
        });
      }
    }
  } catch (error) {
    console.error("Session Reminder Check Error:", error);
  } finally {
    checkInProgress = false;
  }
};

export const startSessionReminderScheduler = () => {
  if (schedulerStarted) return;
  schedulerStarted = true;

  runSessionReminderCheck();
  setInterval(runSessionReminderCheck, CHECK_INTERVAL_MS);
};
