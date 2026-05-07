// controllers/menuController.js

import Menu from "../models/Menu.js";
import Order from "../models/Order.js";


// ======================================================
// @desc Create Menu Item
// ======================================================
export const createMenuItem = async (req, res) => {
  try {
    const {
      restaurant,
      name,
      description,
      price,
      originalPrice,
      category,
      preparationTime,
      calories,
      isBestSeller,
    } = req.body;

    const item = await Menu.create({
      restaurant,
      name,
      description,
      price,
      originalPrice,
      category,
      preparationTime,
      calories,
      isBestSeller,

      image: req.file
        ? `/uploads/menu/${req.file.filename}`
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      item,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Get Menu By Restaurant
// ======================================================
export const getRestaurantMenu = async (req, res) => {
  try {
    const menu = await Menu.find({
      restaurant: req.params.restaurantId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menu.length,
      menu,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Get Menu Item By ID
// ======================================================
export const getMenuItemById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id)
      .populate("restaurant", "name image");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Update Menu Item
// ======================================================
export const updateMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    item.name = req.body.name || item.name;

    item.description =
      req.body.description || item.description;

    item.price = req.body.price || item.price;

    item.originalPrice =
      req.body.originalPrice || item.originalPrice;

    item.category =
      req.body.category || item.category;

    item.preparationTime =
      req.body.preparationTime || item.preparationTime;

    item.calories =
      req.body.calories || item.calories;

    item.isBestSeller =
      req.body.isBestSeller || item.isBestSeller;

    // Update image
    if (req.file) {
      item.image =
        `/uploads/menu/${req.file.filename}`;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      item,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Delete Menu Item
// ======================================================
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Search Menu Items
// ======================================================
export const searchMenuItems = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const items = await Menu.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      results: items.length,
      items,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      count: items.length,
      items,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// @desc Toggle Menu Availability
// ======================================================
export const toggleAvailability = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    item.isAvailable = !item.isAvailable;

    await item.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      isAvailable: item.isAvailable,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      item.price =
        item.price + (item.price * percentage) / 100;

      await item.save();
    }

    res.status(200).json({
      success: true,
      message: "Prices updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

        itemCount[id] =
          (itemCount[id] || 0) + item.quantity;
      });
    });

    const sortedItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const popularItems = await Menu.find({
      _id: {
        $in: sortedItems.map((item) => item[0]),
      },
    });

    res.status(200).json({
      success: true,
      popularItems,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};