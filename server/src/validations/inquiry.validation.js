import { z } from "zod";

export const createInquirySchema = z.object({
  recipient: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid recipient ID").optional().or(z.literal("")),
  expoId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid expo ID"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
  type: z.enum(["admin_support", "exhibitor_network"], { required_error: "Type must be either admin_support or exhibitor_network" }),
});
