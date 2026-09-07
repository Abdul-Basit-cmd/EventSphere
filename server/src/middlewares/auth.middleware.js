import jwt from "jsonwebtoken";
import config from "../config/config.js";
import sessionModel from "../models/session.model.js";
import exhibitorProfileModel from "../models/exhibitorProfile.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Fail",
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const session = await sessionModel.findById(decoded.sessionId);
    if (!session || session.isRevoked) {
      return res.status(401).json({
        status: "Fail",
        message: "Session expired or revoked. Please log in again.",
      });
    }

    session.lastUsedAt = new Date();
    await session.save();

    req.user = {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Fail",
        message: "Access token expired",
        code: "TOKEN_EXPIRED" 
      });
    }

    return res.status(401).json({
      status: "Fail",
      message: "Invalid or unauthorized token",
    });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      status: "Fail",
      message: "You do not have permission to access this resource"
    });
  }
  next();
};

export const requireApprovedExhibitor = async (req, res, next) => {
  try {
    const profile = await exhibitorProfileModel.findOne(
      { userId: req.user.userId },
      { approvalStatus: 1 }
    );

    if (!profile || profile.approvalStatus !== "approved") {
      return res.status(403).json({
        status: "Fail",
        message: "Your exhibitor application has not been approved yet"
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Fail",
      message: "An unexpected error occurred"
    });
  }
};
