import { z } from "zod";

export const createExpoSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().trim().min(1, "Location is required"),
  description: z.string().trim().optional(),
  theme: z.string().trim().optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
});

export const updateExpoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  date: z.string().optional(),
  location: z.string().trim().min(1, "Location is required").optional(),
  description: z.string().trim().optional(),
  theme: z.string().trim().optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
});
