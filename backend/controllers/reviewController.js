// controllers/reviewController.js

import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";


// ======================================================
// @desc Create Review
// ======================================================




// ======================================================
// @desc Create Review
// ======================================================

export const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    // Check restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      restaurant: restaurantId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this restaurant",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      rating,
      comment,
    });

    // Get all reviews of restaurant
    const reviews = await Review.find({
      restaurant: restaurantId,
    });

    // Calculate average rating
    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    // Update restaurant rating
    restaurant.rating = avgRating;
    restaurant.totalReviews = reviews.length;

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
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