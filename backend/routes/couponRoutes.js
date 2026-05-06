// routes/couponRoutes.js

import express from "express";
import {
  createCoupon,
  validateCoupon,
  applyCouponToCart,
  disableCoupon,
  getAllCoupons,
} from "../controllers/couponController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.post("/", protect, adminOnly, asyncHandler(createCoupon));
router.post("/validate", protect, asyncHandler(validateCoupon));
router.post("/apply", protect, asyncHandler(applyCouponToCart));

router.put("/disable", protect, adminOnly, asyncHandler(disableCoupon));
router.get("/", protect, adminOnly, asyncHandler(getAllCoupons));

export default router;