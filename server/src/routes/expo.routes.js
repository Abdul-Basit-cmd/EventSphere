import express from "express";
import { getExpos, getExpo, createExpo, updateExpo, deleteExpo } from "../controllers/expo.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { createExpoSchema, updateExpoSchema } from "../validations/expo.validation.js";

const router = express.Router();

router.get("/", getExpos);
router.get("/:id", getExpo);
router.post("/", requireAuth, requireRole("admin"), validateRequest(createExpoSchema), createExpo);
router.patch("/:id", requireAuth, requireRole("admin"), validateRequest(updateExpoSchema), updateExpo);
router.delete("/:id", requireAuth, requireRole("admin"), deleteExpo);

export default router;
