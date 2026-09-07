import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  getActiveSessions,
  revokeSession,
  revokeAllOtherSessions,
  revokeAllSessions,
} from "../controllers/auth.controller.js";
import validateRequest from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  emailSchema,
} from "../validations/user.validation.js";
import { loginRateLimiter, emailRateLimiter, otpRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/verify-email", otpRateLimiter, validateRequest(verifyEmailSchema), verifyEmail);
router.post("/login", loginRateLimiter, validateRequest(loginSchema), login);
router.post("/resend-verification", emailRateLimiter, validateRequest(emailSchema), resendVerificationEmail);
router.post("/refresh", refresh);
router.get("/me", requireAuth, getMe);
router.post("/logout", requireAuth, logout);
router.post("/forgot-password", emailRateLimiter, validateRequest(emailSchema), forgotPassword);
router.post("/reset-password", otpRateLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.get("/sessions", requireAuth, getActiveSessions);
router.delete("/sessions", requireAuth, revokeAllOtherSessions);
router.delete("/sessions/all", requireAuth, revokeAllSessions);
router.delete("/sessions/:id", requireAuth, revokeSession);

export default router;
