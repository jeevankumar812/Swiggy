// routes/deliveryRoutes.js

import express from "express";
import {
  getAvailableOrders,
  acceptDeliveryOrder,
  getAssignedOrders,
  markPickedUp,
  markOutForDelivery,
  markDelivered,
  updateDeliveryLocation,
  getDeliveryEarnings,
} from "../controllers/deliveryController.js";

import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.get("/available", protect, asyncHandler(getAvailableOrders));
router.put("/accept/:id", protect, asyncHandler(acceptDeliveryOrder));
router.get("/my", protect, asyncHandler(getAssignedOrders));

router.put("/picked/:id", protect, asyncHandler(markPickedUp));
router.put("/out/:id", protect, asyncHandler(markOutForDelivery));
router.put("/delivered/:id", protect, asyncHandler(markDelivered));

router.post("/location", protect, asyncHandler(updateDeliveryLocation));
router.get("/earnings", protect, asyncHandler(getDeliveryEarnings));

export default router;