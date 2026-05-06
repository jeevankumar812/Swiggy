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

import {
  protect,
  adminOnly,
  ownerOnly,
} from "../middlewares/authMiddleware.js";

import asyncHandler from "../middlewares/asyncHandler.js";

// 🔥 Upload Middleware
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all restaurants
router.get("/", asyncHandler(getAllRestaurants));

// Search restaurants
router.get("/search", asyncHandler(searchRestaurants));

// Filter restaurants
router.get("/filter", asyncHandler(filterRestaurants));

// Nearby restaurants
router.get("/nearby", asyncHandler(getNearbyRestaurants));

// Single restaurant
router.get("/:id", asyncHandler(getRestaurantById));


// ======================================================
// OWNER ROUTES
// ======================================================

// Create restaurant
router.post(
  "/",
  protect,
  ownerOnly,

  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),

  asyncHandler(createRestaurant)
);


// Owner restaurants
router.get(
  "/owner/my",
  protect,
  ownerOnly,
  asyncHandler(getOwnerRestaurants)
);


// Update restaurant
router.put(
  "/:id",
  protect,
  ownerOnly,

  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),

  asyncHandler(updateRestaurant)
);


// Delete restaurant
router.delete(
  "/:id",
  protect,
  ownerOnly,
  asyncHandler(deleteRestaurant)
);


// Toggle open/close
router.put(
  "/toggle/:id",
  protect,
  ownerOnly,
  asyncHandler(toggleRestaurantStatus)
);


// Restaurant dashboard
router.get(
  "/dashboard/:id",
  protect,
  ownerOnly,
  asyncHandler(getRestaurantDashboard)
);


// ======================================================
// ADMIN ROUTES
// ======================================================

// Optional admin approval routes can go here


export default router;