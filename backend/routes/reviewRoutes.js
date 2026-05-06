// routes/reviewRoutes.js

import express from "express";
import {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
  likeReview,
  reportReview,
  getAverageRating,
} from "../controllers/reviewController.js";

import { protect } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.post("/", protect, asyncHandler(createReview));
router.get("/restaurant/:restaurantId", asyncHandler(getRestaurantReviews));
router.put("/:id", protect, asyncHandler(updateReview));
router.delete("/:id", protect, asyncHandler(deleteReview));

router.post("/like/:id", protect, asyncHandler(likeReview));
router.post("/report/:id", protect, asyncHandler(reportReview));

router.get("/avg/:restaurantId", asyncHandler(getAverageRating));

export default router;