import inquiryModel from "../models/inquiry.model.js";
import expoModel from "../models/expo.model.js";
import userModel from "../models/user.model.js";
import { createNotification, notifyAdmins } from "../utils/notifications.js";

export const createInquiry = async (req, res) => {
  try {
    const { recipient, expoId, subject, message, type } = req.body;
    const senderId = req.user.userId;

    const expo = await expoModel.findById(expoId);
    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    if (type === "exhibitor_network" && !recipient) {
      return res.status(400).json({ status: "Fail", message: "Recipient is required for exhibitor network inquiries" });
    }

    if (recipient) {
      const recipientUser = await userModel.findById(recipient);
      if (!recipientUser) {
        return res.status(404).json({ status: "Fail", message: "Recipient not found" });
      }
    }

    const inquiry = await inquiryModel.create({
      sender: senderId,
      recipient: recipient || null,
      expoId,
      subject,
      message,
      type
    });

    if (type === "admin_support") {
      await notifyAdmins({
        expoId,
        type: "inquiry",
        title: "New support inquiry",
        message: subject,
        metadata: { inquiryId: inquiry._id },
      });
    } else if (recipient) {
      await createNotification({
        userId: recipient,
        expoId,
        type: "inquiry",
        title: "New inquiry received",
        message: subject,
        metadata: { inquiryId: inquiry._id },
      });
    }

    return res.status(201).json({ status: "Ok", data: { inquiry } });
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getMyInquiries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inquiries = await inquiryModel.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate("sender", "name email")
      .populate("recipient", "name email")
      .populate("expoId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: "Ok", data: { inquiries } });
  } catch (error) {
    console.error("Get My Inquiries Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getAdminInquiries = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const total = await inquiryModel.countDocuments({ type: "admin_support" });
    const inquiries = await inquiryModel.find({ type: "admin_support" })
      .populate("sender", "name email")
      .populate("expoId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: "Ok",
      data: {
        inquiries,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error("Get Admin Inquiries Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const replyToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ status: "Fail", message: "Reply message is required" });
    }

    const inquiry = await inquiryModel.findById(id);
    if (!inquiry) {
      return res.status(404).json({ status: "Fail", message: "Inquiry not found" });
    }

    inquiry.adminReply = reply.trim();
    inquiry.status = "replied";
    await inquiry.save();

    await createNotification({
      userId: inquiry.sender,
      expoId: inquiry.expoId,
      type: "support_reply",
      title: "Support inquiry replied",
      message: "An organizer has replied to your inquiry.",
      metadata: { inquiryId: inquiry._id },
    });

    return res.status(200).json({ status: "Ok", data: { inquiry } });
  } catch (error) {
    console.error("Reply To Inquiry Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};
