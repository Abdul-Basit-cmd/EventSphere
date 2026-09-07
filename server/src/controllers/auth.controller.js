import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import exhibitorProfileModel from "../models/exhibitorProfile.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";
import { generateOTP } from "../utils/otp.js";

const ALLOWED_ROLES = ["attendee", "exhibitor"];

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid role selected",
      });
    }

    const isUserExists = await userModel.findOne({ email });
    if (isUserExists) {
      return res.status(409).json({
        status: "Fail",
        message: "User already exists",
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await userModel.create({
      name,
      email,
      role,
      passwordHash: password,
      verificationOTP: hashedOTP,
      verificationOTPExpires,
    });

    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      message: `Your email verification code is: ${otp}\nThis code will expire in 10 minutes.`,
    });

    return res.status(201).json({
      status: "Ok",
      message: "Account created. Please verify your email.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({
      email,
      verificationOTPExpires: { $gt: Date.now() },
    });

    if (!user || !user.verificationOTP) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid or expired verification code",
      });
    }

    const isOTPValid = await bcrypt.compare(otp, user.verificationOTP);
    if (!isOTPValid) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid verification code",
      });
    }

    user.isVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpires = null;
    await user.save();

    return res.status(200).json({
      status: "Ok",
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found with this email.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "Fail",
        message: "That email is already verified.",
      });
    }

    // Throttle — don't allow spamming resend
    const cooldown = 60 * 1000; // 1 minute
    if (
      user.verificationOTPExpires &&
      user.verificationOTPExpires - Date.now() >
        10 * 60 * 1000 - cooldown
    ) {
      return res.status(429).json({
        status: "Fail",
        message: "Please wait before requesting another verification email.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const verificationOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.verificationOTP = hashedOTP;
    user.verificationOTPExpires = verificationOTPExpires;

    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Verify your email",
      message: `Your new email verification code is: ${otp}\nThis code will expire in 10 minutes.`,
    });

    return res.status(200).json({
      status: "Ok",
      message: "OTP has been sent successfully.",
    });
  } catch (error) {
    console.error("Resend Verification Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        status: "Fail",
        message: "Please verify your email first.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid credentials",
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await sessionModel.create({
      userId: user._id,
      refreshTokenhash: "placeholder",
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt,
    });

    const refreshToken = jwt.sign(
      { userId: user._id, sessionId: session._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    session.refreshTokenhash = refreshTokenHash;
    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const accessToken = jwt.sign(
      { userId: user._id, sessionId: session._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN },
    );

    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    if (user.role === "exhibitor") {
      const profile = await exhibitorProfileModel.findOne({ userId: user._id }).select("onboardingComplete approvalStatus");
      responseUser.onboardingComplete = profile?.onboardingComplete ?? false;
      responseUser.approvalStatus = profile?.approvalStatus ?? null;
    }

    const apiResponse = {
      user: responseUser,
      accessToken: accessToken,
    };

    return res.status(200).json({
      status: "Ok",
      message: "Login Successful",
      data: { user: responseUser, accessToken },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "Fail",
        message: "Refresh token is missing",
      });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const session = await sessionModel.findById(decoded.sessionId);
    if (!session || session.isRevoked) {
      return res.status(401).json({
        status: "Fail",
        message: "Session not found or has been revoked",
      });
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenhash,
    );

    if (!isRefreshTokenValid) {
      session.isRevoked = true;
      await session.save();

      return res.status(401).json({
        status: "Fail",
        message:
          "Invalid refresh token. Session has been revoked for security.",
      });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, sessionId: session._id, role: decoded.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN },
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, sessionId: session._id, role: decoded.role },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    session.refreshTokenhash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: "Ok",
      message: "Token refreshed successfully!",
      data: { accessToken },
    });
  } catch (error) {
    console.error("Refresh Error:", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res
        .status(401)
        .json({ status: "Fail", message: "Unauthorized token state" });
    }

    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findById(userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "Ok",
      data: { user },
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.user?.sessionId;

    if (sessionId) {
      await sessionModel.findByIdAndUpdate(sessionId, { isRevoked: true });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      status: "Ok",
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const otp = generateOTP();
      const hashedOTP = await bcrypt.hash(otp, 10);

      user.resetPasswordOTP = hashedOTP;
      user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message: `Your password reset code is: ${otp}\nThis code will expire in 10 minutes.`,
      });
    }

    // Always return the same response — don't leak whether the email exists
    return res.status(200).json({
      status: "Ok",
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await userModel.findOne({
      email,
      resetPasswordOTPExpires: { $gt: Date.now() },
    }).select("+passwordHash");

    if (!user || !user.resetPasswordOTP) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid or expired reset code.",
      });
    }

    const isOTPValid = await bcrypt.compare(otp, user.resetPasswordOTP);
    if (!isOTPValid) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid reset code.",
      });
    }

    user.passwordHash = password;

    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;

    await user.save();
    await sessionModel.updateMany({ userId: user._id }, { isRevoked: true });

    return res.status(200).json({
      status: "Ok",
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const getActiveSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentSessionId = req.user.sessionId;

    const sessions = await sessionModel
      .find({
        userId,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
      })
      .select("id userAgent ipAddress createdAt updatedAt");

    // Mark which session belongs to the device making this request
    const sessionsWithCurrentFlag = sessions.map((session) => ({
      ...session.toObject(),
      isCurrent: session._id.toString() === currentSessionId?.toString(),
    }));

    return res.status(200).json({
      status: "Ok",
      data: { results: sessions.length, sessions: sessionsWithCurrentFlag },
    });
  } catch (error) {
    console.error("Get Active Sessions Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const currentSessionId = req.user.sessionId;

    const session = await sessionModel.findOneAndUpdate(
      { _id: id, userId },
      { isRevoked: true }, // Fixed: soft-delete using isRevoked
      { new: true },
    );

    if (!session) {
      return res.status(404).json({
        status: "Fail",
        message: "Session not found or unauthorized",
      });
    }

    const isCurrentDevice = id === currentSessionId?.toString();

    // If the user revoked the session of the device they're currently on,
    // clear their refresh cookie too so the frontend redirect to /login sticks
    if (isCurrentDevice) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      });
    }

    return res.status(200).json({
      status: "Ok",
      message: "Session revoked successfully",
      data: { isCurrentDevice },
    });
  } catch (error) {
    console.error("Revoke Session Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

// 3. Revoke all other sessions (excluding the current active one)
export const revokeAllOtherSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentSessionId = req.user.sessionId; // Extracted from decoded token in auth middleware

    await sessionModel.updateMany(
      {
        userId,
        _id: { $ne: currentSessionId }, // Exclude current active session
        isRevoked: false,
      },
      { isRevoked: true },
    );

    return res.status(200).json({
      status: "Ok",
      message: "All other sessions revoked successfully",
    });
  } catch (error) {
    console.error("Revoke All Other Sessions Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};

// 4. Revoke ALL sessions including the current one — full logout everywhere
export const revokeAllSessions = async (req, res) => {
  try {
    const userId = req.user.userId;

    await sessionModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );

    // Current device is included in this wipe, so clear its cookie too
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      status: "Ok",
      message: "All sessions revoked successfully",
    });
  } catch (error) {
    console.error("Revoke All Sessions Error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred",
    });
  }
};
