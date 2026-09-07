import expoModel from "../models/expo.model.js";
import boothModel from "../models/booth.model.js";
import boothVisitModel from "../models/boothVisit.model.js";
import scheduleModel from "../models/schedule.model.js";
import inquiryModel from "../models/inquiry.model.js";
import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import notificationModel from "../models/notification.model.js";
import { createNotificationsForUsers, notifyExpoAttendees } from "../utils/notifications.js";

export const getExpos = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const total = await expoModel.countDocuments();
    const expos = await expoModel.find().sort({ date: 1 }).skip(skip).limit(limit);

    return res.status(200).json({
      status: "Ok",
      data: { expos, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    console.error("Get Expos Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getExpo = async (req, res) => {
  try {
    const { id } = req.params;
    const expo = await expoModel.findById(id);

    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    return res.status(200).json({ status: "Ok", data: { expo } });
  } catch (error) {
    console.error("Get Expo Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const createExpo = async (req, res) => {
  try {
    const { title, date, location, description, theme, status } = req.body || {};

    const expo = await expoModel.create({
      title,
      date,
      location,
      description,
      theme,
      status,
      createdBy: req.user.userId,
    });

    return res.status(201).json({ status: "Ok", data: { expo } });
  } catch (error) {
    console.error("Create Expo Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const updateExpo = async (req, res) => {
  try {
    const { id } = req.params;
    const expo = await expoModel.findById(id);

    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    const allowedFields = ["title", "date", "location", "description", "theme", "status"];
    allowedFields.forEach((field) => {
      if (req.body && req.body[field] !== undefined) {
        expo[field] = req.body[field];
      }
    });

    await expo.save();

    await notifyExpoAttendees(expo._id, {
      type: "expo_update",
      title: "Expo details updated",
      message: `${expo.title} has updated event details.`,
      metadata: { expoId: expo._id },
    });

    const exhibitorBooths = await boothModel
      .find({ expoId: expo._id, assignedTo: { $ne: null } })
      .populate("assignedTo", "userId");

    await createNotificationsForUsers(
      exhibitorBooths.map((booth) => booth.assignedTo?.userId),
      {
        expoId: expo._id,
        type: "expo_update",
        title: "Expo details updated",
        message: `${expo.title} has updated event details.`,
        metadata: { expoId: expo._id },
      }
    );

    return res.status(200).json({ status: "Ok", data: { expo } });
  } catch (error) {
    console.error("Update Expo Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const deleteExpo = async (req, res) => {
  try {
    const { id } = req.params;
    await boothModel.deleteMany({ expoId: id });
    await scheduleModel.deleteMany({ expoId: id });
    await inquiryModel.deleteMany({ expoId: id });
    await attendeeRegistrationModel.deleteMany({ expo: id });
    await boothVisitModel.deleteMany({ expoId: id });
    await notificationModel.deleteMany({ expoId: id });
    const expo = await expoModel.findByIdAndDelete(id);

    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    return res.status(200).json({ status: "Ok", message: "Expo deleted successfully" });
  } catch (error) {
    console.error("Delete Expo Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};
