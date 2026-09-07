import { z } from "zod";

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters long")
  .max(16, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters long")
      .max(60, "Name cannot exceed 60 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please provide a valid email address"),

    role: z.enum(["attendee", "exhibitor"], {
      error: (issue) => {
        if (issue.input === "" || issue.input === undefined) {
          return "Role is required";
        }

        return "Role must be attendee or exhibitor";
      },
    }),

    password: passwordSchema,
  })
  .strict();

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email({ message: "Please provide a valid email address" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const verifyEmailSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .min(1, "Email is required")
      .email({ message: "Please provide a valid email address" }),
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be exactly 6 digits"),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .min(1, "Email is required")
      .email({ message: "Please provide a valid email address" }),
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be exactly 6 digits"),
    password: passwordSchema,
  })
  .strict();

export const emailSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .min(1, "Email is required")
      .email({ message: "Please provide a valid email address" }),
  })
  .strict();
