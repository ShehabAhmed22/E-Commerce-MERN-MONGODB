import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ─── Authenticate (required) ──────────────────────────────────
export const authenticate = async (req, res, next) => {
  try {
    // Support both cookie (httpOnly) and Authorization header (Postman / mobile)
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });

    const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(userId).select(
      "name email role createdAt",
    );
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists." });

    req.user = user;
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

// ─── Authorize (role-based) ───────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Insufficient permissions." });
    }
    next();
  };
};

// ─── Optional authenticate ────────────────────────────────────
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user =
      (await User.findById(userId).select("name email role createdAt")) || null;
  } catch {
    req.user = null;
  }
  next();
};
