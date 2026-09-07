import express from "express";
import { registerForExpo } from "../controllers/attendee.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", requireAuth, requireRole("attendee"), registerForExpo);

export default router;
