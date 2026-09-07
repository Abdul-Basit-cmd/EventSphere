import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A session must belong to a user"],
      index: true,
    },
    refreshTokenhash: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expiresAfterSeconds: 0 }, 
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    isRevoked: {
      type: Boolean,
      required: true,
      default: false, 
    },
  },
  {
    timestamps: true,
  },
);

const sessionModel = mongoose.model("Session", sessionSchema);
export default sessionModel;