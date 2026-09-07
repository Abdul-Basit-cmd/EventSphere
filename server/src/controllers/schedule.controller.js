import scheduleModel from "../models/schedule.model.js";
import expoModel from "../models/expo.model.js";
import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import { notifyExpoAttendees } from "../utils/notifications.js";

export const getSessions = async (req, res) => {
  try {
    const { expoId } = req.params;
    const sessions = await scheduleModel.find({ expoId }).sort({ startTime: 1 });
    return res.status(200).json({ status: "Ok", data: { sessions } });
  } catch (error) {
    console.error("Get Sessions Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getSession = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const session = await scheduleModel.findOne({ _id: id, expoId });

    if (!session) {
      return res.status(404).json({ status: "Fail", message: "Session not found" });
    }

    return res.status(200).json({ status: "Ok", data: { session } });
  } catch (error) {
    console.error("Get Session Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const createSession = async (req, res) => {
  try {
    const { expoId } = req.params;
    const { topic, speaker, location, startTime, endTime } = req.body || {};

    const expo = await expoModel.findById(expoId);
    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    const session = await scheduleModel.create({ expoId, topic, speaker, location, startTime, endTime });

    await notifyExpoAttendees(expoId, {
      type: "schedule_update",
      title: "New session added",
      message: `${session.topic} was added to ${expo.title}.`,
      metadata: { sessionId: session._id },
    });

    return res.status(201).json({ status: "Ok", data: { session } });
  } catch (error) {
    console.error("Create Session Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const session = await scheduleModel.findOne({ _id: id, expoId });

    if (!session) {
      return res.status(404).json({ status: "Fail", message: "Session not found" });
    }

    const allowedFields = ["topic", "speaker", "location", "startTime", "endTime"];
    allowedFields.forEach((field) => {
      if (req.body && req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();

    await notifyExpoAttendees(expoId, {
      type: "schedule_update",
      title: "Session updated",
      message: `${session.topic} has updated schedule details.`,
      metadata: { sessionId: session._id },
    });

    return res.status(200).json({ status: "Ok", data: { session } });
  } catch (error) {
    console.error("Update Session Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const session = await scheduleModel.findOneAndDelete({ _id: id, expoId });

    if (!session) {
      return res.status(404).json({ status: "Fail", message: "Session not found" });
    }

    await attendeeRegistrationModel.updateMany(
      { expo: expoId },
      { $pull: { bookmarkedSessions: session._id } }
    );

    await notifyExpoAttendees(expoId, {
      type: "schedule_update",
      title: "Session removed",
      message: `${session.topic} was removed from the schedule.`,
      metadata: { sessionId: session._id },
    });

    return res.status(200).json({ status: "Ok", message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete Session Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};
