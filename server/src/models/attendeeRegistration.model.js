import mongoose from "mongoose";

const attendeeRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true,
      index: true,
    },
    bookmarkedSessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],
  },
  { timestamps: true }
);

attendeeRegistrationSchema.index({ user: 1, expo: 1 }, { unique: true });

export default mongoose.model("AttendeeRegistration", attendeeRegistrationSchema);
