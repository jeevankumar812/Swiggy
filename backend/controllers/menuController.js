// controllers/menuController.js

import Menu from "../models/Menu.js";
import Order from "../models/Order.js";


// ======================================================
// @desc Create Menu Item
// ======================================================
export const createMenuItem = async (req, res) => {
  try {
    const { restaurant, name, description, price, category, image } = req.body;

    const item = await Menu.create({
      restaurant,
      name,
      description,
      price,
      category,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Menu item created",
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Menu By Restaurant
// ======================================================
export const getRestaurantMenu = async (req, res) => {
  try {
    const menu = await Menu.find({
      restaurant: req.params.restaurantId,
    });

    res.status(200).json({
      success: true,
      count: menu.length,
      menu,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Menu Item By ID
// ======================================================
export const getMenuItemById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id).populate("restaurant");

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Update Menu Item
// ======================================================
export const updateMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.price = req.body.price || item.price;
    item.category = req.body.category || item.category;
    item.image = req.body.image || item.image;

    await item.save();

    res.status(200).json({
      success: true,
      message: "Menu updated",
      item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Delete Menu Item
// ======================================================
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Search Menu Items
// ======================================================
export const searchMenuItems = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const items = await Menu.find({
      name: { $regex: keyword, $options: "i" },
    });

    res.status(200).json({
      success: true,
      results: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Filter Menu By Category
// ======================================================
export const filterMenuByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    const items = await Menu.find({
      category,
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
// @desc Toggle Availability
// ======================================================
export const toggleAvailability = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    item.isAvailable = !item.isAvailable;

    await item.save();

    res.status(200).json({
      success: true,
      message: "Availability updated",
      isAvailable: item.isAvailable,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Bulk Update Prices
// ======================================================
export const bulkUpdatePrices = async (req, res) => {
  try {
    const { percentage } = req.body;

    const items = await Menu.find();

    for (let item of items) {
      item.price = item.price + (item.price * percentage) / 100;
      await item.save();
    }

    res.status(200).json({
      success: true,
      message: "Prices updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get Popular Items
// ======================================================
export const getPopularItems = async (req, res) => {
  try {
    const orders = await Order.find();

    let itemCount = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.menuItem.toString();
        itemCount[id] = (itemCount[id] || 0) + item.quantity;
      });
    });

    const sorted = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const popularItems = await Menu.find({
      _id: { $in: sorted.map((i) => i[0]) },
    });

    res.status(200).json({
      success: true,
      popularItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};