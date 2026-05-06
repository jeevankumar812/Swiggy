// controllers/adminController.js

import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Review from "../models/Review.js";


// ======================================================
// @desc Get Dashboard Stats
// ======================================================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenue = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Revenue Analytics
// ======================================================
export const getRevenueAnalytics = async (req, res) => {
  try {
    const analytics = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get All Users (Admin)
// ======================================================
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get All Restaurants
// ======================================================
export const getAllRestaurantsAdmin = async (req, res) => {
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
// @desc Approve Restaurant
// ======================================================
export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    restaurant.isApproved = true; // add this field in schema
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant approved",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Reject Restaurant
// ======================================================
export const rejectRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Restaurant rejected and removed",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get All Orders
// ======================================================
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("deliveryPartner", "name");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Suspend User
// ======================================================
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = true; // ensure this field exists
    await user.save();

    res.status(200).json({
      success: true,
      message: "User suspended",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Activate User
// ======================================================
export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User activated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Send Notification (Dummy)
// ======================================================
export const sendNotification = async (req, res) => {
  try {
    const { message } = req.body;

    res.status(200).json({
      success: true,
      message: `Notification sent: ${message}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Platform Reports
// ======================================================
export const getPlatformReports = async (req, res) => {
  try {
    const reports = {
      users: await User.countDocuments(),
      restaurants: await Restaurant.countDocuments(),
      orders: await Order.countDocuments(),
      reviews: await Review.countDocuments(),
    };

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};