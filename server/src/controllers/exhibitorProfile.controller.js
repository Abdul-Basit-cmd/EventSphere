import exhibitorProfileModel from "../models/exhibitorProfile.model.js";
import boothModel from "../models/booth.model.js";
import inquiryModel from "../models/inquiry.model.js";
import { sendEmail } from "../utils/email.js";
import config from "../config/config.js";
import { createNotification, notifyAdmins } from "../utils/notifications.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await exhibitorProfileModel.findOne({ userId });

    return res.status(200).json({
      status: "Ok",
      data: { profile: profile || null }
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const getMyBooths = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await exhibitorProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "Exhibitor profile not found"
      });
    }

    const booths = await boothModel.find({ assignedTo: profile._id }).populate("expoId", "title startDate endDate location");

    return res.status(200).json({
      status: "Ok",
      data: { booths }
    });
  } catch (error) {
    console.error("Get My Booths Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const getNeighbors = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await exhibitorProfileModel.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ status: "Fail", message: "Exhibitor profile not found" });
    }

    const myBooths = await boothModel.find({ assignedTo: profile._id }).select("expoId");
    if (!myBooths.length) {
      return res.status(200).json({ status: "Ok", data: { neighbors: [] } });
    }

    const expoIds = [...new Set(myBooths.map(b => b.expoId.toString()))];

    const neighbors = await boothModel.find({
      expoId: { $in: expoIds },
      assignedTo: { $ne: profile._id },
      status: "assigned"
    }).populate("assignedTo", "companyName contactPerson contactPhone website").populate("expoId", "title");

    return res.status(200).json({ status: "Ok", data: { neighbors } });
  } catch (error) {
    console.error("Get Neighbors Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await exhibitorProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ status: "Fail", message: "Exhibitor profile not found" });
    }

    const booths = await boothModel.find({ assignedTo: profile._id }).populate("expoId", "title location");
    const unreadInquiries = await inquiryModel.countDocuments({ recipient: userId, status: "unread" });

    return res.status(200).json({
      status: "Ok",
      data: {
        profileStatus: {
          onboardingComplete: profile.onboardingComplete,
          approvalStatus: profile.approvalStatus,
        },
        booths,
        unreadInquiries
      }
    });
  } catch (error) {
    console.error("Get Dashboard Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingProfile = await exhibitorProfileModel.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({
        status: "Fail",
        message: "Profile already exists"
      });
    }

    const {
      companyName,
      industry,
      description,
      website,
      contactPerson,
      contactPhone,
      productsServices,
      documents,
      logo
    } = req.body || {};

    const newProfile = await exhibitorProfileModel.create({
      userId,
      companyName,
      industry,
      description,
      website,
      contactPerson,
      contactPhone,
      productsServices,
      documents,
      logo,
      onboardingComplete: false,
      approvalStatus: "draft"
    });

    return res.status(201).json({
      status: "Ok",
      data: { profile: newProfile }
    });
  } catch (error) {
    console.error("Create Profile Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await exhibitorProfileModel.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "Profile not found"
      });
    }

    if (profile.onboardingComplete && profile.approvalStatus !== "rejected") {
      return res.status(400).json({
        status: "Fail",
        message: "Profile already submitted and is under review"
      });
    }

    const allowedFields = [
      "companyName", "industry", "description", "website",
      "contactPerson", "contactPhone", "productsServices", "documents", "logo"
    ];

    allowedFields.forEach(field => {
      if (req.body && req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    return res.status(200).json({
      status: "Ok",
      data: { profile }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const submitProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    let profile = await exhibitorProfileModel.findOne({ userId });
    if (!profile) {
      const {
        companyName,
        industry,
        description,
        website,
        contactPerson,
        contactPhone,
        productsServices,
        documents,
        logo
      } = req.body || {};

      profile = await exhibitorProfileModel.create({
        userId,
        companyName,
        industry,
        description,
        website,
        contactPerson,
        contactPhone,
        productsServices,
        documents,
        logo,
        onboardingComplete: true,
        approvalStatus: "pending",
        submittedAt: new Date()
      });

      await notifyAdmins({
        type: "application_update",
        title: "Exhibitor application submitted",
        message: `${profile.companyName || 'An exhibitor'} submitted an exhibitor application.`,
        metadata: { exhibitorProfileId: profile._id },
      });

      return res.status(200).json({
        status: "Ok",
        data: { profile }
      });
    }

    if (profile.onboardingComplete && profile.approvalStatus !== "rejected") {
      return res.status(400).json({
        status: "Fail",
        message: "Profile already submitted"
      });
    }

    const allowedFields = [
      "companyName", "industry", "description", "website",
      "contactPerson", "contactPhone", "productsServices", "documents", "logo"
    ];

    allowedFields.forEach(field => {
      if (req.body && req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    profile.onboardingComplete = true;
    profile.approvalStatus = "pending";
    profile.submittedAt = new Date();

    await profile.save();

    await notifyAdmins({
      type: "application_update",
      title: "Exhibitor application submitted",
      message: `${profile.companyName} submitted an exhibitor application.`,
      metadata: { exhibitorProfileId: profile._id },
    });

    return res.status(200).json({
      status: "Ok",
      data: { profile }
    });
  } catch (error) {
    console.error("Submit Profile Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};


//admin
export const getExhibitors = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.approvalStatus = status;
    }

    const profiles = await exhibitorProfileModel.find(query)
      .populate("userId", "name email")
      .sort({ submittedAt: 1 });

    return res.status(200).json({
      status: "Ok",
      data: { profiles }
    });
  } catch (error) {
    console.error("Get Exhibitors Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const getExhibitor = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await exhibitorProfileModel.findById(id).populate("userId", "name email");
    
    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "Profile not found"
      });
    }

    return res.status(200).json({
      status: "Ok",
      data: { profile }
    });
  } catch (error) {
    console.error("Get Exhibitor Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const approveExhibitor = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await exhibitorProfileModel.findById(id).populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "Profile not found"
      });
    }

    if (!profile.onboardingComplete) {
      return res.status(400).json({
        status: "Fail",
        message: "Cannot approve a profile that has not been submitted"
      });
    }

    if (profile.approvalStatus === "approved") {
      return res.status(400).json({
        status: "Fail",
        message: "Exhibitor is already approved"
      });
    }

    profile.approvalStatus = "approved";
    profile.reviewedAt = new Date();
    profile.reviewedBy = req.user.userId;

    await profile.save();

    await createNotification({
      userId: profile.userId._id,
      type: "application_update",
      title: "Application approved",
      message: "Your exhibitor application has been approved.",
      metadata: { exhibitorProfileId: profile._id },
    });

    await sendEmail({
      email: profile.userId.email,
      subject: "Your EventSphere Exhibitor Application Has Been Approved",
      message: `Congratulations! Your exhibitor application has been approved.\nYou can now access the exhibitor portal at ${config.CLIENT_URL}/exhibitor`,
    });

    return res.status(200).json({
      status: "Ok",
      data: { profile }
    });
  } catch (error) {
    console.error("Approve Exhibitor Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const rejectExhibitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalNote } = req.body;
    
    const profile = await exhibitorProfileModel.findById(id).populate("userId", "name email");

    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "Profile not found"
      });
    }

    profile.approvalStatus = "rejected";
    profile.approvalNote = approvalNote;
    profile.reviewedAt = new Date();
    profile.reviewedBy = req.user.userId;

    await profile.save();

    await createNotification({
      userId: profile.userId._id,
      type: "application_update",
      title: "Application rejected",
      message: "Your exhibitor application has been rejected. Please review the organizer note.",
      metadata: { exhibitorProfileId: profile._id },
    });

    await sendEmail({
      email: profile.userId.email,
      subject: "Update on Your EventSphere Exhibitor Application",
      message: `Your exhibitor application has been rejected for the following reason:\n\n${approvalNote}\n\nYou can update your profile and resubmit it for review.`,
    });

    return res.status(200).json({
      status: "Ok",
      data: { profile }
    });
  } catch (error) {
    console.error("Reject Exhibitor Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};

export const reopenExhibitor = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await exhibitorProfileModel.findById(id);

    if (!profile) {
      return res.status(404).json({
        status: "Fail",
        message: "Profile not found"
      });
    }

    profile.approvalStatus = "pending";
    profile.onboardingComplete = false;
    profile.approvalNote = null;

    await profile.save();

    return res.status(200).json({
      status: "Ok",
      data: { profile }
    });
  } catch (error) {
    console.error("Reopen Exhibitor Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};
