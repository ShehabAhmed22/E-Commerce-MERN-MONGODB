import User from "../../../models/User.js";
import ApiError from "../../../utils/apiError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client as redis } from "../../../config/redis.js";

// ─── Helpers ──────────────────────────────────────────────────

const generateTokens = (userId) => ({
  accessToken: jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  }),
  refreshToken: jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  }),
});

const storeRefreshToken = (userId, refreshToken) =>
  redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);

const setCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// ─── Controllers ──────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, "Email is already registered");

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { ...formatUser(user), accessToken },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const { userId } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_token:${userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = (req, res) => {
  res.status(200).json({ success: true, data: formatUser(req.user) });
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public (refresh token required)
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.cookies;
    if (!token) throw new ApiError(401, "No refresh token provided");

    const { userId } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const stored = await redis.get(`refresh_token:${userId}`);
    if (stored !== token)
      throw new ApiError(401, "Refresh token is invalid or expired");

    const { accessToken, refreshToken: newRefresh } = generateTokens(userId);
    await storeRefreshToken(userId, newRefresh);
    setCookies(res, accessToken, newRefresh);

    res
      .status(200)
      .json({ success: true, message: "Token refreshed", accessToken });
  } catch (error) {
    next(error);
  }
};
