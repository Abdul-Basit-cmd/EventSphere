import mongoose from "mongoose";

const boothVisitSchema = new mongoose.Schema(
  {
    attendee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true,
      index: true,
    },
    boothId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booth",
      required: true,
      index: true,
    },
    visitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

boothVisitSchema.index({ attendee: 1, boothId: 1 }, { unique: true });
boothVisitSchema.index({ expoId: 1, boothId: 1, visitedAt: -1 });

export default mongoose.model("BoothVisit", boothVisitSchema);
