// controllers/restaurantController.js

import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";


// ======================================================
// @desc Create Restaurant
// @route POST /api/restaurants
// ======================================================
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      address,
      phone,
      email,
      cuisine,
      deliveryTime,
      openingTime,
      closingTime,
      minimumOrderAmount,
      deliveryFee,
    } = req.body;

    const restaurant = await Restaurant.create({
      name,
      description,
      location,
      address,
      phone,
      email,
      cuisine,
      deliveryTime,
      openingTime,
      closingTime,
      minimumOrderAmount,
      deliveryFee,

      image: req.files?.image?.[0]?.filename
        ? `/uploads/restaurants/${req.files.image[0].filename}`
        : "",

      bannerImage: req.files?.bannerImage?.[0]?.filename
        ? `/uploads/restaurants/${req.files.bannerImage[0].filename}`
        : "",

      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Get All Restaurants
// ======================================================
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Get Restaurant By ID
// ======================================================
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      restaurant,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Update Restaurant
// ======================================================
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.name = req.body.name || restaurant.name;
    restaurant.description = req.body.description || restaurant.description;
    restaurant.location = req.body.location || restaurant.location;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.phone = req.body.phone || restaurant.phone;
    restaurant.email = req.body.email || restaurant.email;
    restaurant.cuisine = req.body.cuisine || restaurant.cuisine;
    restaurant.deliveryTime =
      req.body.deliveryTime || restaurant.deliveryTime;

    restaurant.openingTime =
      req.body.openingTime || restaurant.openingTime;

    restaurant.closingTime =
      req.body.closingTime || restaurant.closingTime;

    restaurant.minimumOrderAmount =
      req.body.minimumOrderAmount ||
      restaurant.minimumOrderAmount;

    restaurant.deliveryFee =
      req.body.deliveryFee || restaurant.deliveryFee;

    // Update Images
    if (req.files?.image?.[0]?.filename) {
      restaurant.image =
        `/uploads/restaurants/${req.files.image[0].filename}`;
    }

    if (req.files?.bannerImage?.[0]?.filename) {
      restaurant.bannerImage =
        `/uploads/restaurants/${req.files.bannerImage[0].filename}`;
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Delete Restaurant
// ======================================================
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Search Restaurants
// ======================================================
export const searchRestaurants = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const restaurants = await Restaurant.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          cuisine: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          location: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      results: restaurants.length,
      restaurants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Filter Restaurants
// ======================================================
export const filterRestaurants = async (req, res) => {
  try {
    const {
      cuisine,
      rating,
      isOpen,
    } = req.query;

    let query = {};

    if (cuisine) {
      query.cuisine = cuisine;
    }

    if (rating) {
      query.rating = {
        $gte: Number(rating),
      };
    }

    if (isOpen) {
      query.isOpen = isOpen === "true";
    }

    const restaurants = await Restaurant.find(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Nearby Restaurants
// ======================================================
export const getNearbyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      isOpen: true,
    }).limit(10);

    res.status(200).json({
      success: true,
      restaurants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Toggle Restaurant Open/Close
// ======================================================
export const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.isOpen = !restaurant.isOpen;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant status updated",
      isOpen: restaurant.isOpen,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Restaurant Dashboard
// ======================================================
export const getRestaurantDashboard = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant =
      await Restaurant.findById(restaurantId);

    const totalOrders =
      await Order.countDocuments();

    const totalReviews =
      await Review.countDocuments({
        restaurant: restaurantId,
      });

    res.status(200).json({
      success: true,
      dashboard: {
        restaurantName: restaurant?.name,
        totalOrders,
        totalReviews,
        rating: restaurant?.rating,
        totalRatings: restaurant?.totalReviews,
        isOpen: restaurant?.isOpen,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Get Owner Restaurants
// ======================================================
export const getOwnerRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};