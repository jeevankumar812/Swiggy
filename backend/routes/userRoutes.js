// routes/userRoutes.js

import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
  getUserById,
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserRole,
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// USER
router.get("/me", protect, asyncHandler(getMyProfile));
router.put("/me", protect, asyncHandler(updateMyProfile));
router.put("/change-password", protect, asyncHandler(changePassword));
router.delete("/me", protect, asyncHandler(deleteMyAccount));

// ADMIN
router.get("/", protect, adminOnly, asyncHandler(getAllUsers));
router.get("/:id", protect, adminOnly, asyncHandler(getUserById));
router.put("/block/:id", protect, adminOnly, asyncHandler(blockUser));
router.put("/unblock/:id", protect, adminOnly, asyncHandler(unblockUser));
router.put("/role/:id", protect, adminOnly, asyncHandler(updateUserRole));

export default router;