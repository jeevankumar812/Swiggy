// routes/notificationRoutes.js

import express from "express";
import {
  sendOrderPlacedNotification,
  sendOrderStatusNotification,
  sendPaymentSuccessNotification,
  sendPromotionalNotification,
  getMyNotifications,
} from "../controllers/notificationController.js";

import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.post("/order", protect, asyncHandler(sendOrderPlacedNotification));
router.post("/status", protect, asyncHandler(sendOrderStatusNotification));
router.post("/payment", protect, asyncHandler(sendPaymentSuccessNotification));
router.post("/promo", protect, asyncHandler(sendPromotionalNotification));

router.get("/my", protect, asyncHandler(getMyNotifications));

export default router;