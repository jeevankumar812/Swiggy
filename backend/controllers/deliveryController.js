// controllers/deliveryController.js

import Order from "../models/Order.js";
import Payment from "../models/Payment.js";


// ======================================================
// @desc Get Available Orders (not yet assigned to delivery)
// @route GET /api/delivery/available-orders
// ======================================================
export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "OUT_FOR_DELIVERY",
      deliveryPartner: { $exists: false },
    })
      .populate("user", "name address")
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
// @desc Accept Delivery Order
// @route PUT /api/delivery/accept/:id
// ======================================================
export const acceptDeliveryOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.deliveryPartner) {
      return res.status(400).json({ success: false, message: "Already assigned" });
    }

    order.deliveryPartner = req.user._id;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order accepted for delivery",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Assigned Orders
// @route GET /api/delivery/my-orders
// ======================================================
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
    })
      .populate("user", "name address")
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
// @desc Mark Picked Up
// ======================================================
export const markPickedUp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "OUT_FOR_DELIVERY";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order picked up",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Mark Out For Delivery
// ======================================================
export const markOutForDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "OUT_FOR_DELIVERY";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order is out for delivery",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Mark Delivered
// ======================================================
export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.status = "DELIVERED";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order delivered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Update Delivery Location (Dummy)
// ======================================================
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    res.status(200).json({
      success: true,
      message: "Location updated",
      location: { lat, lng },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Delivery Earnings
// ======================================================
export const getDeliveryEarnings = async (req, res) => {
  try {
    const deliveredOrders = await Order.find({
      deliveryPartner: req.user._id,
      status: "DELIVERED",
    });

    const earnings = deliveredOrders.length * 50; // example: ₹50 per delivery

    res.status(200).json({
      success: true,
      totalDeliveries: deliveredOrders.length,
      earnings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};