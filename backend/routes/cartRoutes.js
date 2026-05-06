// routes/cartRoutes.js

import express from "express";
import {
  getMyCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  calculateCartTotal,
} from "../controllers/cartController.js";

import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.get("/", protect,  asyncHandler(getMyCart));
router.post("/add", protect, asyncHandler(addToCart));
router.put("/update", protect, asyncHandler(updateCartQuantity));
router.delete("/remove", protect, asyncHandler(removeCartItem));
router.delete("/clear", protect, asyncHandler(clearCart));
router.post("/apply-coupon", protect, asyncHandler(applyCoupon));
router.delete("/remove-coupon", protect, asyncHandler(removeCoupon));
router.get("/total", protect, asyncHandler(calculateCartTotal));

export default router;