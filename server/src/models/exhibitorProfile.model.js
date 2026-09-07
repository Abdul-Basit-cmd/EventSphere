import mongoose from "mongoose";

const exhibitorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Company information
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    website: { type: String, trim: true },

    // Contact
    contactPerson: { type: String, trim: true },
    contactPhone: { type: String, trim: true },

    // Products and services
    productsServices: { type: String, trim: true },

    // Documents
    documents: [{ type: String }],

    // Logo
    logo: { type: String, default: null },

    // Onboarding / Application state
    onboardingComplete: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },
    approvalNote: { type: String, default: null },

    // Timestamps
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const exhibitorProfileModel = mongoose.model(
  "ExhibitorProfile",
  exhibitorProfileSchema
);

export default exhibitorProfileModel;
