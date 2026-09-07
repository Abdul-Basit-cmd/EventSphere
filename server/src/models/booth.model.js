import mongoose from "mongoose";

const boothSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true,
      index: true,
    },
    boothNumber: { type: String, required: true, trim: true },
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "assigned"],
      default: "available",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExhibitorProfile",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booth", boothSchema);
