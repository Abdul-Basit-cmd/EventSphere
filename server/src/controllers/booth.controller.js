import boothModel from "../models/booth.model.js";
import boothVisitModel from "../models/boothVisit.model.js";
import expoModel from "../models/expo.model.js";
import exhibitorProfileModel from "../models/exhibitorProfile.model.js";
import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import { createNotification, notifyAdmins } from "../utils/notifications.js";

export const getBooths = async (req, res) => {
  try {
    const { expoId } = req.params;
    const booths = await boothModel.find({ expoId }).populate("assignedTo", "companyName").sort({ boothNumber: 1 });
    return res.status(200).json({ status: "Ok", data: { booths } });
  } catch (error) {
    console.error("Get Booths Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const getBooth = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const booth = await boothModel.findOne({ _id: id, expoId }).populate("assignedTo", "companyName");

    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    return res.status(200).json({ status: "Ok", data: { booth } });
  } catch (error) {
    console.error("Get Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const recordBoothVisit = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const attendee = req.user.userId;

    const booth = await boothModel.findOne({ _id: id, expoId });
    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    const registration = await attendeeRegistrationModel.findOne({ user: attendee, expo: expoId });
    if (!registration) {
      return res.status(403).json({ status: "Fail", message: "You must register for this expo before recording booth visits" });
    }

    const existingVisit = await boothVisitModel.findOne({ attendee, boothId: id });
    if (existingVisit) {
      return res.status(200).json({ status: "Ok", data: { visit: existingVisit, alreadyRecorded: true } });
    }

    const visit = await boothVisitModel.create({
      attendee,
      expoId,
      boothId: id,
      visitedAt: new Date(),
    });

    return res.status(201).json({ status: "Ok", data: { visit, alreadyRecorded: false } });
  } catch (error) {
    if (error.code === 11000) {
      const visit = await boothVisitModel.findOne({ attendee: req.user.userId, boothId: req.params.id });
      return res.status(200).json({ status: "Ok", data: { visit, alreadyRecorded: true } });
    }

    console.error("Record Booth Visit Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const createBooth = async (req, res) => {
  try {
    const { expoId } = req.params;
    const { boothNumber, size, status } = req.body || {};

    const expo = await expoModel.findById(expoId);
    if (!expo) {
      return res.status(404).json({ status: "Fail", message: "Expo not found" });
    }

    const booth = await boothModel.create({ expoId, boothNumber, size, status });
    return res.status(201).json({ status: "Ok", data: { booth } });
  } catch (error) {
    console.error("Create Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const updateBooth = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const booth = await boothModel.findOne({ _id: id, expoId });

    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    const allowedFields = ["boothNumber", "size", "status"];
    allowedFields.forEach((field) => {
      if (req.body && req.body[field] !== undefined) {
        booth[field] = req.body[field];
      }
    });

    await booth.save();

    if (booth.assignedTo) {
      const profile = await exhibitorProfileModel.findById(booth.assignedTo);
      if (profile) {
        await createNotification({
          userId: profile.userId,
          expoId,
          type: "booth_update",
          title: "Booth details updated",
          message: `Booth ${booth.boothNumber} has updated details.`,
          metadata: { boothId: booth._id },
        });
      }
    }

    return res.status(200).json({ status: "Ok", data: { booth } });
  } catch (error) {
    console.error("Update Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const deleteBooth = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const booth = await boothModel.findOneAndDelete({ _id: id, expoId });

    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    await boothVisitModel.deleteMany({ boothId: id });

    return res.status(200).json({ status: "Ok", message: "Booth deleted successfully" });
  } catch (error) {
    console.error("Delete Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const assignBooth = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const { exhibitorProfileId } = req.body || {};

    const booth = await boothModel.findOne({ _id: id, expoId });
    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    const profile = await exhibitorProfileModel.findById(exhibitorProfileId);
    if (!profile) {
      return res.status(404).json({ status: "Fail", message: "Exhibitor profile not found" });
    }

    if (booth.status === "assigned") {
      return res.status(400).json({ status: "Fail", message: "Booth is already assigned. Unassign it first." });
    }

    if (profile.approvalStatus !== "approved") {
      return res.status(400).json({ status: "Fail", message: "Exhibitor must be approved before assigning a booth" });
    }

    booth.assignedTo = exhibitorProfileId;
    booth.status = "assigned";
    await booth.save();

    await createNotification({
      userId: profile.userId,
      expoId,
      type: "booth_update",
      title: "Booth assigned",
      message: `Booth ${booth.boothNumber} has been assigned to your company.`,
      metadata: { boothId: booth._id },
    });

    return res.status(200).json({ status: "Ok", data: { booth } });
  } catch (error) {
    console.error("Assign Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const unassignBooth = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const booth = await boothModel.findOne({ _id: id, expoId });

    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    const previousExhibitorId = booth.assignedTo;
    booth.assignedTo = null;
    booth.status = "available";
    await booth.save();

    if (previousExhibitorId) {
      const profile = await exhibitorProfileModel.findById(previousExhibitorId);
      if (profile) {
        await createNotification({
          userId: profile.userId,
          expoId,
          type: "booth_update",
          title: "Booth unassigned",
          message: `Booth ${booth.boothNumber} is no longer assigned to your company.`,
          metadata: { boothId: booth._id },
        });
      }
    }

    return res.status(200).json({ status: "Ok", data: { booth } });
  } catch (error) {
    console.error("Unassign Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};

export const reserveBooth = async (req, res) => {
  try {
    const { expoId, id } = req.params;
    const userId = req.user.userId;

    const profile = await exhibitorProfileModel.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ status: "Fail", message: "Exhibitor profile not found" });
    }

    if (!profile.onboardingComplete || profile.approvalStatus === "rejected") {
      return res.status(403).json({ status: "Fail", message: "You must complete onboarding and have an eligible profile to reserve a booth" });
    }

    const boothQuery = expoId ? { _id: id, expoId } : { _id: id };
    const booth = await boothModel.findOne(boothQuery);
    if (!booth) {
      return res.status(404).json({ status: "Fail", message: "Booth not found" });
    }

    if (booth.status !== "available") {
      return res.status(400).json({ status: "Fail", message: "Booth is no longer available" });
    }

    booth.status = "reserved";
    booth.assignedTo = profile._id;
    await booth.save();

    await Promise.all([
      createNotification({
        userId: profile.userId,
        expoId: booth.expoId,
        type: "booth_update",
        title: "Booth reserved",
        message: `Booth ${booth.boothNumber} has been reserved for your company.`,
        metadata: { boothId: booth._id },
      }),
      notifyAdmins({
        expoId: booth.expoId,
        type: "booth_update",
        title: "Booth reservation requested",
        message: `${profile.companyName} reserved booth ${booth.boothNumber}.`,
        metadata: { boothId: booth._id, exhibitorProfileId: profile._id },
      }),
    ]);

    return res.status(200).json({ status: "Ok", data: { booth } });
  } catch (error) {
    console.error("Reserve Booth Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};
