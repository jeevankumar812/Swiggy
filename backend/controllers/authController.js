// controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

// ======================================================
// Generate JWT Token
// ======================================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ======================================================
// @desc Register User
// @route POST /api/auth/register
// ======================================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // ===============================
    // Check Existing Email
    // ===============================
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ===============================
    // Check Existing Phone Number
    // ===============================
    const existingPhone = await User.findOne({ phone });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // ===============================
    // Hash Password
    // ===============================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===============================
    // Create User
    // ===============================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    // ===============================
    // Remove Password
    // ===============================
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: userObj,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// @desc Login User
// @route POST /api/auth/login
// ======================================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ===============================
    // Remove Password
    // ===============================
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: userObj,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// @desc Logout User
// @route POST /api/auth/logout
// ======================================================
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// @desc Refresh Token
// @route POST /api/auth/refresh
// ======================================================
export const refreshToken = async (req, res) => {
  try {
    const newToken = generateToken(req.user._id);

    res.status(200).json({
      success: true,
      token: newToken,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// @desc Forgot Password
// @route POST /api/auth/forgot-password
// ======================================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// @desc Reset Password
// @route POST /api/auth/reset-password
// @route POST /api/auth/reset-password
// ======================================================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// @desc Verify Email
// @route POST /api/auth/verify-email
// ======================================================
export const verifyEmail = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};