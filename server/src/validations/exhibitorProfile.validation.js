import { z } from "zod";

const documentsSchema = z.array(z.string().trim().min(1, "Document reference cannot be empty"));

export const rejectApplicationSchema = z.object({
  approvalNote: z.string({ required_error: "Rejection reason is required" }).trim().min(1, "Rejection reason is required")
});

export const createProfileSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  industry: z.string().trim().min(1, "Industry is required"),
  description: z.string().trim().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contactPerson: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  productsServices: z.string().trim().optional(),
  documents: documentsSchema.optional(),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const updateProfileSchema = z.object({
  companyName: z.string().trim().min(1, "Company name cannot be empty").optional(),
  industry: z.string().trim().min(1, "Industry cannot be empty").optional(),
  description: z.string().trim().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contactPerson: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  productsServices: z.string().trim().optional(),
  documents: documentsSchema.optional(),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const submitProfileSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required for submission"),
  industry: z.string().trim().min(1, "Industry is required for submission"),
  description: z.string().trim().min(10, "Description must be at least 10 characters for submission"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contactPerson: z.string().trim().min(1, "Contact person is required for submission"),
  contactPhone: z.string().trim().min(5, "Contact phone is required for submission"),
  productsServices: z.string().trim().min(1, "Products and services are required for submission"),
  documents: documentsSchema.min(1, "At least one required document is needed for submission"),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});
