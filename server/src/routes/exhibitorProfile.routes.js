import express from "express";
import {
  getProfile, getMyBooths, getNeighbors, getDashboard, createProfile, updateProfile, submitProfile,
  getExhibitors, getExhibitor, approveExhibitor, rejectExhibitor, reopenExhibitor
} from "../controllers/exhibitorProfile.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { rejectApplicationSchema, createProfileSchema, updateProfileSchema, submitProfileSchema } from "../validations/exhibitorProfile.validation.js";

const router = express.Router();

// Exhibitor routes
router.get("/me", requireAuth, requireRole("exhibitor"), getProfile);
router.get("/me/booths", requireAuth, requireRole("exhibitor"), getMyBooths);
router.get("/me/neighbors", requireAuth, requireRole("exhibitor"), getNeighbors);
router.get("/me/dashboard", requireAuth, requireRole("exhibitor"), getDashboard);
router.post("/me", requireAuth, requireRole("exhibitor"), validateRequest(createProfileSchema), createProfile);
router.patch("/me", requireAuth, requireRole("exhibitor"), validateRequest(updateProfileSchema), updateProfile);
router.patch("/me/submit", requireAuth, requireRole("exhibitor"), validateRequest(submitProfileSchema), submitProfile);
// Admin routes
router.get("/", requireAuth, requireRole("admin"), getExhibitors);
router.get("/:id", requireAuth, requireRole("admin"), getExhibitor);
router.patch("/:id/approve", requireAuth, requireRole("admin"), approveExhibitor);
router.patch("/:id/reject", requireAuth, requireRole("admin"), validateRequest(rejectApplicationSchema), rejectExhibitor);
router.patch("/:id/reopen", requireAuth, requireRole("admin"), reopenExhibitor);

export default router;
