import rateLimit from "express-rate-limit";
import config from '../config/config.js'

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: config.NODE_ENV === "development" ? 20 : 5, 
  message: {
    status: "Fail",
    message: "Too many login attempts. Please try again after 15 minutes."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.NODE_ENV === "development" ? 20 : 5, 
  message: {
    status: "Fail",
    message: "Too many requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Strict limit of 5 attempts for OTP to prevent brute force
  message: {
    status: "Fail",
    message: "Too many verification attempts. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
