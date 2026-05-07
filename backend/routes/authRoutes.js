// routes/authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();
import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", asyncHandler(logoutUser));
router.post("/refresh-token", protect, asyncHandler(refreshToken));
router.post("/forget-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPassword));
router.post("/verify-email", asyncHandler(verifyEmail));

export default router;