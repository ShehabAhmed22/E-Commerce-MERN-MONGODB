import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  refreshToken,
} from "../controller/auth.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", authenticate, getMe);

export default router;
