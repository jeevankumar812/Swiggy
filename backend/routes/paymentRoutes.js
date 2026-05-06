// routes/paymentRoutes.js

import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  paymentWebhook,
  getPaymentByOrderId,
  getMyPayments,
  refundPayment,
  paymentFailedHandler,
} from "../controllers/paymentController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.post("/create-order", protect, asyncHandler(createRazorpayOrder));
router.post("/verify", protect, asyncHandler(verifyRazorpayPayment));
router.post("/webhook", paymentWebhook);

router.get("/order/:orderId", protect, asyncHandler(getPaymentByOrderId));
router.get("/my", protect, asyncHandler(getMyPayments));

router.post("/failed", protect, asyncHandler(paymentFailedHandler));
router.post("/refund/:id", protect, adminOnly, asyncHandler(refundPayment));

export default router;