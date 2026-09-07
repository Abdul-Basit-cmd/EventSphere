import express from "express";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  streamNotifications,
} from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getMyNotifications);
router.get("/stream", requireAuth, streamNotifications);
router.patch("/read-all", requireAuth, markAllNotificationsRead);
router.patch("/:id/read", requireAuth, markNotificationRead);

export default router;
