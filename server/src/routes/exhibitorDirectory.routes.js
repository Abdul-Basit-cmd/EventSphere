import express from "express";
import { getDirectory } from "../controllers/exhibitorDirectory.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/directory", requireAuth, requireRole("admin", "exhibitor", "attendee"), getDirectory);

export default router;
