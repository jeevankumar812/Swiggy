// controllers/analyticsController.js

import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Menu from "../models/Menu.js";
import Restaurant from "../models/Restaurant.js";


// ======================================================
// @desc Sales Analytics
// ======================================================
export const getSalesAnalytics = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: "DELIVERED" } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: sales[0] || {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Top Restaurants
// ======================================================
export const getTopRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ rating: -1 }).limit(5);

    res.status(200).json({
      success: true,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Top Selling Items
// ======================================================
export const getTopSellingItems = async (req, res) => {
  try {
    const orders = await Order.find();

    let count = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.menuItem.toString();
        count[id] = (count[id] || 0) + item.quantity;
      });
    });

    const sorted = Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const items = await Menu.find({
      _id: { $in: sorted.map(i => i[0]) },
    });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Daily Orders
// ======================================================
export const getDailyOrders = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Monthly Revenue
// ======================================================
export const getMonthlyRevenue = async (req, res) => {
  try {
    const data = await Payment.aggregate([
      { $match: { status: "SUCCESS" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};