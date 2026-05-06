// controllers/restaurantController.js

import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";


// ======================================================
// @desc Create Restaurant (Owner/Admin)
// @route POST /api/restaurants
// ======================================================
export const createRestaurant = async (req, res) => {
  try {
    const { name, image, location, cuisine, deliveryTime } = req.body;

    const restaurant = await Restaurant.create({
      name,
      image,
      location,
      cuisine,
      deliveryTime,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get All Restaurants
// @route GET /api/restaurants
// ======================================================
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Update Restaurant
// ======================================================
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    restaurant.name = req.body.name || restaurant.name;
    restaurant.image = req.body.image || restaurant.image;
    restaurant.location = req.body.location || restaurant.location;
    restaurant.cuisine = req.body.cuisine || restaurant.cuisine;
    restaurant.deliveryTime = req.body.deliveryTime || restaurant.deliveryTime;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Delete Restaurant
// ======================================================
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: "Restaurant deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Search Restaurants
// ======================================================
export const searchRestaurants = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const restaurants = await Restaurant.find({
      name: { $regex: keyword, $options: "i" },
    });

    res.status(200).json({
      success: true,
      results: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Filter Restaurants
// ======================================================
export const filterRestaurants = async (req, res) => {
  try {
    const { cuisine, rating } = req.query;

    let query = {};

    if (cuisine) query.cuisine = cuisine;
    if (rating) query.rating = { $gte: Number(rating) };

    const restaurants = await Restaurant.find(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Nearby Restaurants (Dummy - no geo)
// ======================================================
export const getNearbyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().limit(10);

    res.status(200).json({
      success: true,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Toggle Open/Close Status
// ======================================================
export const toggleRestaurantStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      isOpen: restaurant.isOpen,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Restaurant Dashboard
// ======================================================
export const getRestaurantDashboard = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments({ restaurant: restaurantId });

    const restaurant = await Restaurant.findById(restaurantId);

    res.status(200).json({
      success: true,
      dashboard: {
        name: restaurant?.name,
        totalOrders,
        totalReviews,
        rating: restaurant?.rating,
        isOpen: restaurant?.isOpen,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};