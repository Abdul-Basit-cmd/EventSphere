import express from "express";
import { createInquiry, getMyInquiries, getAdminInquiries, replyToInquiry } from "../controllers/inquiry.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { createInquirySchema } from "../validations/inquiry.validation.js";

const router = express.Router();

router.post("/", requireAuth, requireRole("exhibitor", "attendee"), validateRequest(createInquirySchema), createInquiry);
router.get("/me", requireAuth, requireRole("exhibitor", "attendee"), getMyInquiries);
router.get("/support", requireAuth, requireRole("admin"), getAdminInquiries);
router.patch("/:id/reply", requireAuth, requireRole("admin"), replyToInquiry);

export default router;
