// routes/menuRoutes.js

import express from "express";

import {
  createMenuItem,
  getRestaurantMenu,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  filterMenuByCategory,
  toggleAvailability,
  bulkUpdatePrices,
  getPopularItems,
} from "../controllers/menuController.js";

import {
  protect,
  ownerOnly,
} from "../middlewares/authMiddleware.js";

import asyncHandler from "../middlewares/asyncHandler.js";

// 🔥 Upload Middleware
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


// ======================================================
// PUBLIC ROUTES
// ======================================================

// Search menu items
router.get(
  "/search",
  asyncHandler(searchMenuItems)
);

// Filter menu
router.get(
  "/filter",
  asyncHandler(filterMenuByCategory)
);

// Popular food items
router.get(
  "/popular",
  asyncHandler(getPopularItems)
);

// Get menu by restaurant
router.get(
  "/restaurant/:restaurantId",
  asyncHandler(getRestaurantMenu)
);

// Get single menu item
router.get(
  "/:id",
  asyncHandler(getMenuItemById)
);


// ======================================================
// OWNER ROUTES
// ======================================================

// Create menu item with image upload
router.post(
  "/",
  protect,
  ownerOnly,

  upload.single("image"),

  asyncHandler(createMenuItem)
);


// Update menu item with image upload
router.put(
  "/:id",
  protect,
  ownerOnly,

  upload.single("image"),

  asyncHandler(updateMenuItem)
);


// Delete menu item
router.delete(
  "/:id",
  protect,
  ownerOnly,
  asyncHandler(deleteMenuItem)
);


// Toggle availability
router.put(
  "/toggle/:id",
  protect,
  ownerOnly,
  asyncHandler(toggleAvailability)
);


// Bulk price update
router.put(
  "/bulk-update",
  protect,
  ownerOnly,
  asyncHandler(bulkUpdatePrices)
);


export default router;