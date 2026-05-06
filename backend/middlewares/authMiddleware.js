// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";


// ======================================================
// @desc Protect Route (Authentication)
// ======================================================
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};



// ======================================================
// @desc Admin Only
// ======================================================
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
};


// ======================================================
// @desc Owner Only
// ======================================================
export const ownerOnly = (req, res, next) => {
  if (req.user && req.user.role === "OWNER") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Owner access required",
    });
  }
};


// ======================================================
// @desc Delivery Only
// ======================================================
export const deliveryOnly = (req, res, next) => {
  if (req.user && req.user.role === "DELIVERY") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Delivery access required",
    });
  }
};