import { z } from "zod";

export const createBoothSchema = z.object({
  boothNumber: z.string().trim().min(1, "Booth number is required"),
  size: z.enum(["small", "medium", "large"], { required_error: "Size is required" }),
  status: z.enum(["available", "reserved", "assigned"]).optional(),
});

export const updateBoothSchema = z.object({
  boothNumber: z.string().trim().min(1, "Booth number is required").optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  status: z.enum(["available", "reserved", "assigned"]).optional(),
});

export const assignBoothSchema = z.object({
  exhibitorProfileId: z.string().min(1, "Exhibitor profile ID is required"),
});
