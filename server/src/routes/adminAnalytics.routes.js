import express from "express";
import { getAnalytics } from "../controllers/adminAnalytics.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), getAnalytics);

export default router;
