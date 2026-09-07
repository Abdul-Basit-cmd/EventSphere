import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true,
      index: true,
    },
    topic: { type: String, required: true, trim: true },
    speaker: { type: String, trim: true },
    location: { type: String, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", scheduleSchema);
