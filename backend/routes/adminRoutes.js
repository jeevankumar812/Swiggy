// routes/adminRoutes.js

import express from "express";
import {
  getDashboardStats,
  getRevenueAnalytics,
  getAllUsersAdmin,
  getAllRestaurantsAdmin,
  approveRestaurant,
  rejectRestaurant,
  getAllOrdersAdmin,
  suspendUser,
  activateUser,
  sendNotification,
  getPlatformReports,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, asyncHandler(getDashboardStats));
router.get("/revenue", protect, adminOnly, asyncHandler(getRevenueAnalytics));

router.get("/users", protect, adminOnly, asyncHandler(getAllUsersAdmin));
router.put("/user/suspend/:id", protect, adminOnly, asyncHandler(suspendUser));
router.put("/user/activate/:id", protect, adminOnly, asyncHandler(activateUser));

router.get("/restaurants", protect, adminOnly, asyncHandler(getAllRestaurantsAdmin));
router.put("/restaurant/approve/:id", protect, adminOnly, asyncHandler(approveRestaurant));
router.delete("/restaurant/reject/:id", protect, adminOnly, asyncHandler(rejectRestaurant));

router.get("/orders", protect, adminOnly, asyncHandler(getAllOrdersAdmin));

router.post("/notify", protect, adminOnly, asyncHandler(sendNotification));
router.get("/reports", protect, adminOnly, asyncHandler(getPlatformReports));

export default router;