import express from "express";
import { getSessions, getSession, createSession, updateSession, deleteSession } from "../controllers/schedule.controller.js";
import { toggleBookmark } from "../controllers/attendee.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { createScheduleSchema, updateScheduleSchema } from "../validations/schedule.validation.js";

const router = express.Router({ mergeParams: true });

router.get("/", getSessions);
router.get("/:id", getSession);
router.post("/", requireAuth, requireRole("admin"), validateRequest(createScheduleSchema), createSession);
router.post("/:sessionId/bookmark", requireAuth, requireRole("attendee"), toggleBookmark);
router.patch("/:id", requireAuth, requireRole("admin"), validateRequest(updateScheduleSchema), updateSession);
router.delete("/:id", requireAuth, requireRole("admin"), deleteSession);

export default router;
