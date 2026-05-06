// routes/orderRoutes.js

import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  reorderItems,
  trackOrder,
  updateOrderStatus,
  assignDeliveryPartner,
  getAllOrders,
  getPendingOrders,
  getRestaurantOrders,
} from "../controllers/orderController.js";

import { protect, adminOnly, ownerOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();


// ======================================================
// USER ROUTES
// ======================================================

// 🔥 Unified order (COD + Razorpay)
router.post("/", protect, asyncHandler(placeOrder));

router.get("/my", protect, asyncHandler(getMyOrders));

// ⚠️ specific routes FIRST
router.get("/track/:id", protect, asyncHandler(trackOrder));
router.post("/reorder/:id", protect, asyncHandler(reorderItems));
router.put("/cancel/:id", protect, asyncHandler(cancelOrder));

// generic LAST
router.get("/:id", protect, asyncHandler(getOrderById));


// ======================================================
// OWNER ROUTES
// ======================================================
router.get("/restaurant/:id", protect, ownerOnly, asyncHandler(getRestaurantOrders));
router.put("/status/:id", protect, ownerOnly, asyncHandler(updateOrderStatus));


// ======================================================
// ADMIN ROUTES
// ======================================================
router.get("/", protect, adminOnly, asyncHandler(getAllOrders));
router.get("/pending", protect, adminOnly, asyncHandler(getPendingOrders));
router.put("/assign/:id", protect, adminOnly, asyncHandler(assignDeliveryPartner));


export default router;