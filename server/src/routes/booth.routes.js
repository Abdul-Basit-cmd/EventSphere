import express from "express";
import { getBooths, getBooth, createBooth, updateBooth, deleteBooth, assignBooth, unassignBooth, reserveBooth, recordBoothVisit } from "../controllers/booth.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import validateRequest from "../middlewares/validate.middleware.js";
import { createBoothSchema, updateBoothSchema, assignBoothSchema } from "../validations/booth.validation.js";

const router = express.Router({ mergeParams: true });

router.get("/", getBooths);
router.get("/:id", getBooth);
router.post("/", requireAuth, requireRole("admin"), validateRequest(createBoothSchema), createBooth);
router.post("/:id/visits", requireAuth, requireRole("attendee"), recordBoothVisit);
router.patch("/:id", requireAuth, requireRole("admin"), validateRequest(updateBoothSchema), updateBooth);
router.delete("/:id", requireAuth, requireRole("admin"), deleteBooth);
router.post("/:id/reserve", requireAuth, requireRole("exhibitor"), reserveBooth);
router.patch("/:id/assign", requireAuth, requireRole("admin"), validateRequest(assignBoothSchema), assignBooth);
router.patch("/:id/unassign", requireAuth, requireRole("admin"), unassignBooth);

export default router;
