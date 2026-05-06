// routes/ownerRoutes.js

import express from "express";
import {
  getOwnerDashboard,
  getOwnerRevenue,
  getOwnerOrders,
  acceptOrder,
  rejectOrder,
  markPreparing,
  markReadyForPickup,
  manageRestaurantTiming,
} from "../controllers/ownerController.js";

import { protect, ownerOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.get("/dashboard", protect, ownerOnly, asyncHandler(getOwnerDashboard));
router.get("/revenue", protect, ownerOnly, asyncHandler(getOwnerRevenue));
router.get("/orders", protect, ownerOnly, asyncHandler(getOwnerOrders));

router.put("/accept/:id", protect, ownerOnly, asyncHandler(acceptOrder));
router.put("/reject/:id", protect, ownerOnly, asyncHandler(rejectOrder));
router.put("/preparing/:id", protect, ownerOnly, asyncHandler(markPreparing));
router.put("/ready/:id", protect, ownerOnly, asyncHandler(markReadyForPickup));

router.put("/restaurant/timing/:id", protect, ownerOnly, asyncHandler(manageRestaurantTiming));

export default router;