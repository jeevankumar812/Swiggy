// controllers/ownerController.js

import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";


// ======================================================
// @desc Get Owner Dashboard
// @route GET /api/owner/dashboard
// ======================================================
export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const restaurants = await Restaurant.find({ createdBy: ownerId });
    const restaurantIds = restaurants.map(r => r._id);

    const totalOrders = await Order.countDocuments({
      "items.menuItem": { $exists: true },
    });

    const pendingOrders = await Order.countDocuments({
      status: "PLACED",
    });

    const preparingOrders = await Order.countDocuments({
      status: "PREPARING",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalRestaurants: restaurants.length,
        totalOrders,
        pendingOrders,
        preparingOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Owner Revenue
// @route GET /api/owner/revenue
// ======================================================
export const getOwnerRevenue = async (req, res) => {
  try {
    const revenue = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      revenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Owner Orders
// ======================================================
export const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("items.menuItem");

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
// @desc Accept Order
// ======================================================
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "PREPARING";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order accepted and preparing",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Reject Order
// ======================================================
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order rejected",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Mark Preparing
// ======================================================
export const markPreparing = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "PREPARING";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order is being prepared",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Mark Ready For Pickup
// ======================================================
export const markReadyForPickup = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "OUT_FOR_DELIVERY";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order ready for pickup",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Manage Restaurant Timing (Open/Close)
// ======================================================
export const manageRestaurantTiming = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    restaurant.isOpen = req.body.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant timing updated",
      isOpen: restaurant.isOpen,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};