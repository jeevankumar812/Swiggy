// controllers/reviewController.js

import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";


// ======================================================
// @desc Create Review
// ======================================================
export const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Restaurant Reviews
// ======================================================
export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurant: req.params.restaurantId,
    }).populate("user", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Update Review
// ======================================================
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Delete Review
// ======================================================
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Like Review (Dummy)
// ======================================================
export const likeReview = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Review liked (dummy logic)",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Report Review (Dummy)
// ======================================================
export const reportReview = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Review reported (dummy logic)",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Average Rating of Restaurant
// ======================================================
export const getAverageRating = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const result = await Review.aggregate([
      { $match: { restaurant: restaurantId } },
      {
        $group: {
          _id: "$restaurant",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const avgRating = result[0]?.avgRating || 0;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: avgRating,
    });

    res.status(200).json({
      success: true,
      averageRating: avgRating,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};