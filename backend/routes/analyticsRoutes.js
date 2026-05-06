// routes/analyticsRoutes.js

import express from "express";
import {
  getSalesAnalytics,
  getTopRestaurants,
  getTopSellingItems,
  getDailyOrders,
  getMonthlyRevenue,
} from "../controllers/analyticsController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.get("/sales", protect, adminOnly,asyncHandler(getSalesAnalytics));
router.get("/top-restaurants", asyncHandler(getTopRestaurants));
router.get("/top-items", asyncHandler(getTopSellingItems));
router.get("/daily-orders", protect, adminOnly, asyncHandler(getDailyOrders));
router.get("/monthly-revenue", protect, adminOnly, asyncHandler(getMonthlyRevenue));

export default router;