// routes/restaurantRoutes.js

import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  filterRestaurants,
  getNearbyRestaurants,
  toggleRestaurantStatus,
  getRestaurantDashboard,
  getOwnerRestaurants,
} from "../controllers/restaurantController.js";

import { protect, adminOnly, ownerOnly } from "../middlewares/authMiddleware.js";

import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

// PUBLIC
router.get("/", asyncHandler(getAllRestaurants));
router.get("/search", asyncHandler(searchRestaurants));
router.get("/filter", asyncHandler(filterRestaurants));
router.get("/nearby", asyncHandler(getNearbyRestaurants));
router.get("/:id", asyncHandler(getRestaurantById));

// OWNER
router.post("/", protect, ownerOnly, asyncHandler(createRestaurant));
router.get("/owner/my", protect, ownerOnly, asyncHandler(getOwnerRestaurants));
router.put("/:id", protect, ownerOnly, asyncHandler(updateRestaurant));
router.delete("/:id", protect, ownerOnly, asyncHandler(deleteRestaurant));
router.put("/toggle/:id", protect, ownerOnly, asyncHandler(toggleRestaurantStatus));
router.get("/dashboard/:id", protect, ownerOnly, asyncHandler(getRestaurantDashboard));

// ADMIN
// (optional: approval routes handled in adminController)

export default router;