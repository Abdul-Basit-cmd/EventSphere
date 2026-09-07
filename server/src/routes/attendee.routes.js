import express from "express";
import { getMySchedule } from "../controllers/attendee.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me/schedule", requireAuth, requireRole("attendee"), getMySchedule);

export default router;
