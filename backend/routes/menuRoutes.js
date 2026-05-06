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

import { protect, ownerOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

// PUBLIC
router.get("/search", asyncHandler(searchMenuItems));
router.get("/filter", asyncHandler(filterMenuByCategory));
router.get("/popular", asyncHandler(getPopularItems));

router.get("/restaurant/:restaurantId", asyncHandler(getRestaurantMenu));
router.get("/:id", asyncHandler(getMenuItemById));

// OWNER
router.post("/", protect, ownerOnly, asyncHandler(createMenuItem));
router.put("/:id", protect, ownerOnly, asyncHandler(updateMenuItem));
router.delete("/:id", protect, ownerOnly, asyncHandler(deleteMenuItem));
router.put("/toggle/:id", protect, ownerOnly, asyncHandler(toggleAvailability));
router.put("/bulk-update", protect, ownerOnly, asyncHandler(bulkUpdatePrices));

export default router;