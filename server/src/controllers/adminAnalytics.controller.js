import mongoose from "mongoose";
import expoModel from "../models/expo.model.js";
import boothModel from "../models/booth.model.js";
import boothVisitModel from "../models/boothVisit.model.js";
import exhibitorProfileModel from "../models/exhibitorProfile.model.js";
import attendeeRegistrationModel from "../models/attendeeRegistration.model.js";
import scheduleModel from "../models/schedule.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const { expoId } = req.query;

    if (expoId && !mongoose.Types.ObjectId.isValid(expoId)) {
      return res.status(400).json({ status: "Fail", message: "Invalid expo ID" });
    }

    const expoObjectId = expoId ? new mongoose.Types.ObjectId(expoId) : null;
    const expoFilter = expoObjectId ? { _id: expoObjectId } : {};
    const boothFilter = expoObjectId ? { expoId: expoObjectId } : {};
    const boothVisitFilter = expoObjectId ? { expoId: expoObjectId } : {};
    const registrationFilter = expoObjectId ? { expo: expoObjectId } : {};
    const sessionFilter = expoObjectId ? { expoId: expoObjectId } : {};

    const [
      totalExpos,
      totalBooths,
      assignedBooths,
      reservedBooths,
      totalExhibitors,
      pendingExhibitors,
      approvedExhibitors,
      rejectedExhibitors,
      totalRegistrations,
      uniqueAttendees,
      totalSessions,
      bookmarkSummary,
      popularSessions,
      registrationTrends,
      totalBoothVisits,
      boothTraffic
    ] = await Promise.all([
      expoModel.countDocuments(expoFilter),
      boothModel.countDocuments(boothFilter),
      boothModel.countDocuments({ ...boothFilter, status: "assigned" }),
      boothModel.countDocuments({ ...boothFilter, status: "reserved" }),
      exhibitorProfileModel.countDocuments(),
      exhibitorProfileModel.countDocuments({ approvalStatus: "pending" }),
      exhibitorProfileModel.countDocuments({ approvalStatus: "approved" }),
      exhibitorProfileModel.countDocuments({ approvalStatus: "rejected" }),
      attendeeRegistrationModel.countDocuments(registrationFilter),
      attendeeRegistrationModel.distinct("user", registrationFilter),
      scheduleModel.countDocuments(sessionFilter),
      attendeeRegistrationModel.aggregate([
        { $match: registrationFilter },
        { $project: { bookmarkCount: { $size: "$bookmarkedSessions" } } },
        { $group: { _id: null, totalBookmarks: { $sum: "$bookmarkCount" } } },
      ]),
      attendeeRegistrationModel.aggregate([
        { $match: registrationFilter },
        { $unwind: "$bookmarkedSessions" },
        { $group: { _id: "$bookmarkedSessions", bookmarks: { $sum: 1 } } },
        { $sort: { bookmarks: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "schedules",
            localField: "_id",
            foreignField: "_id",
            as: "session",
          },
        },
        { $unwind: "$session" },
        {
          $project: {
            _id: 0,
            sessionId: "$_id",
            topic: "$session.topic",
            speaker: "$session.speaker",
            location: "$session.location",
            startTime: "$session.startTime",
            expoId: "$session.expoId",
            bookmarks: 1,
          },
        },
      ]),
      attendeeRegistrationModel.aggregate([
        { $match: registrationFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            registrations: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: "$_id", registrations: 1 } },
      ]),
      boothVisitModel.countDocuments(boothVisitFilter),
      boothVisitModel.aggregate([
        { $match: boothVisitFilter },
        {
          $group: {
            _id: "$boothId",
            visits: { $sum: 1 },
            uniqueVisitors: { $addToSet: "$attendee" },
            lastVisitedAt: { $max: "$visitedAt" },
          },
        },
        { $sort: { visits: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "booths",
            localField: "_id",
            foreignField: "_id",
            as: "booth",
          },
        },
        { $unwind: "$booth" },
        {
          $lookup: {
            from: "exhibitorprofiles",
            localField: "booth.assignedTo",
            foreignField: "_id",
            as: "exhibitor",
          },
        },
        { $unwind: { path: "$exhibitor", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            boothId: "$_id",
            boothNumber: "$booth.boothNumber",
            expoId: "$booth.expoId",
            exhibitorName: "$exhibitor.companyName",
            visits: 1,
            uniqueVisitors: { $size: "$uniqueVisitors" },
            lastVisitedAt: 1,
          },
        },
      ]),
    ]);

    const boothOccupancyRate = totalBooths > 0
      ? parseFloat((((assignedBooths + reservedBooths) / totalBooths) * 100).toFixed(2))
      : 0;
    const totalBookmarks = bookmarkSummary[0]?.totalBookmarks || 0;

    return res.status(200).json({
      status: "Ok",
      data: {
        totalExpos,
        totalBooths,
        assignedBooths,
        reservedBooths,
        boothOccupancyRate,
        totalExhibitors,
        pendingExhibitors,
        approvedExhibitors,
        rejectedExhibitors,
        totalAttendees: uniqueAttendees.length,
        uniqueAttendees: uniqueAttendees.length,
        totalRegistrations,
        totalSessions,
        totalBoothVisits,
        boothTraffic,
        totalBookmarks,
        averageBookmarksPerRegistration: totalRegistrations > 0
          ? parseFloat((totalBookmarks / totalRegistrations).toFixed(2))
          : 0,
        popularSessions,
        registrationTrends
      }
    });
  } catch (error) {
    console.error("Get Analytics Error:", error);
    return res.status(500).json({ status: "Fail", message: "An unexpected error occurred" });
  }
};
