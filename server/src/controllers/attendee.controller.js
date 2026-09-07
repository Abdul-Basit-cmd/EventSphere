import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import expoModel from "../models/expo.model.js";
import scheduleModel from "../models/schedule.model.js";
import { createNotification } from "../utils/notifications.js";

export const registerForExpo = async (req, res) => {
  try {
    const { expoId } = req.params;
    const userId = req.user.userId;

    const expo = await expoModel.findById(expoId);
    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    const existingRegistration = await attendeeRegistrationModel.findOne({ user: userId, expo: expoId });
    if (existingRegistration) {
      return res.status(400).json({ status: "Fail", message: "You are already registered for this expo" });
    }

    const registration = await attendeeRegistrationModel.create({
      user: userId,
      expo: expoId,
      bookmarkedSessions: []
    });

    return res.status(201).json({ status: "Ok", data: { registration } });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ status: "Fail", message: "You are already registered for this expo" });
    }
    console.error("Register For Expo Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { expoId, sessionId } = req.params;
    const userId = req.user.userId;

    const session = await scheduleModel.findById(sessionId);
    if (!session) {
      return res.status(404).json({ status: "Fail", message: "Session not found" });
    }

    if (expoId && session.expoId.toString() !== expoId) {
      return res.status(404).json({ status: "Fail", message: "Session not found for this expo" });
    }

    const registration = await attendeeRegistrationModel.findOne({ user: userId, expo: session.expoId });
    if (!registration) {
      return res.status(403).json({ status: "Fail", message: "You must register for the expo before bookmarking its sessions" });
    }

    const isBookmarked = registration.bookmarkedSessions.some(
      id => id.toString() === sessionId
    );

    if (isBookmarked) {
      registration.bookmarkedSessions = registration.bookmarkedSessions.filter(
        id => id.toString() !== sessionId
      );
    } else {
      registration.bookmarkedSessions.push(sessionId);
    }

    await registration.save();

    if (!isBookmarked) {
      await createNotification({
        userId,
        expoId: session.expoId,
        type: "schedule_reminder",
        title: "Session bookmarked",
        message: `${session.topic} has been added to your schedule reminders.`,
        metadata: { sessionId: session._id, startTime: session.startTime },
      });
    }

    return res.status(200).json({ status: "Ok", data: { registration } });
  } catch (error) {
    console.error("Toggle Bookmark Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getMySchedule = async (req, res) => {
  try {
    const userId = req.user.userId;

    const registrations = await attendeeRegistrationModel.find({ user: userId })
      .populate("expo", "title date location status")
      .populate("bookmarkedSessions");

    return res.status(200).json({ status: "Ok", data: { registrations } });
  } catch (error) {
    console.error("Get My Schedule Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};
