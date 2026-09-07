import { z } from "zod";

export const createScheduleSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required"),
  speaker: z.string().trim().optional(),
  location: z.string().trim().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const updateScheduleSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required").optional(),
  speaker: z.string().trim().optional(),
  location: z.string().trim().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});
