// controllers/cartController.js

import Cart from "../models/Cart.js";
import Menu from "../models/Menu.js";


// ======================================================
// @desc Get My Cart
// ======================================================
export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      cart: cart || { items: [] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Add To Cart
// ======================================================
export const addToCart = async (req, res) => {
  try {
    const { menuId, quantity } = req.body;

    const menuItem = await Menu.findById(menuId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ menuItem: menuId, quantity }],
      });
    } else {
      const existing = cart.items.find(
        (item) => item.menuItem.toString() === menuId
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ menuItem: menuId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Update Cart Quantity
// ======================================================
export const updateCartQuantity = async (req, res) => {
  try {
    const { menuId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find(
      (i) => i.menuItem.toString() === menuId
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Remove Cart Item
// ======================================================
export const removeCartItem = async (req, res) => {
  try {
    const { menuId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Clear Cart
// ======================================================
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Apply Coupon (Dummy)
// ======================================================
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    res.status(200).json({
      success: true,
      message: `Coupon ${code} applied (dummy logic)`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Remove Coupon
// ======================================================
export const removeCoupon = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Coupon removed",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Calculate Cart Total
// ======================================================
export const calculateCartTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.menuItem");

    if (!cart) {
      return res.status(200).json({
        success: true,
        total: 0,
      });
    }

    let total = 0;

    cart.items.forEach((item) => {
      total += item.menuItem.price * item.quantity;
    });

    res.status(200).json({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};