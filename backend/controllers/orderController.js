// controllers/orderController.js

import Order from "../models/Order.js";
import Payment from "../models/Payment.js";


// ======================================================
// @desc Place Order (COD + Razorpay)
// ======================================================
export const placeOrder = async (req, res) => {
  try {
    const { items, totalPrice, deliveryAddress, paymentMethod } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    if (!["COD", "RAZORPAY"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      isPaid: false,
      status: "PLACED",
    });

    // Create Payment Record
    await Payment.create({
      user: req.user._id,
      order: order._id,
      method: paymentMethod,
      amount: totalPrice,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message:
        paymentMethod === "COD"
          ? "COD Order placed successfully"
          : "Order created. Proceed to Razorpay payment",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Get My Orders
// ======================================================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Get Order By ID
// ======================================================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.menuItem")
      .populate("deliveryPartner", "name phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Cancel Order
// ======================================================
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "PLACED") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel after processing",
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Reorder Previous Order
// ======================================================
export const reorderItems = async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id);

    if (!oldOrder) {
      return res.status(404).json({
        success: false,
        message: "Old order not found",
      });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      items: oldOrder.items,
      totalPrice: oldOrder.totalPrice,
      deliveryAddress: oldOrder.deliveryAddress,
      paymentMethod: oldOrder.paymentMethod,
      isPaid: false,
      status: "PLACED",
    });

    res.status(201).json({
      success: true,
      message: "Reorder successful",
      newOrder,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Track Order
// ======================================================
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      status: order.status,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Update Order Status (Owner/Admin)
// ======================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PLACED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id);

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Assign Delivery Partner
// ======================================================
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(req.params.id);

    order.deliveryPartner = deliveryPartnerId;
    order.status = "OUT_FOR_DELIVERY";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Delivery partner assigned",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Get All Orders (Admin)
// ======================================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("deliveryPartner", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Get Pending Orders
// ======================================================
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "PLACED" });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================================
// @desc Get Restaurant Orders (Owner)
// ======================================================
export const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};