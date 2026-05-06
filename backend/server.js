// server.js

import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";

import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import path from "path";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

// MIDDLEWARES
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";


// CONFIG

connectDB();

const app = express();

// ======================================================
// GLOBAL MIDDLEWARES
// ======================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// ======================================================
// API ROUTES
// ======================================================
app.get("/", (req, res) => {
  res.send("🚀 Swiggy Backend API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);


// ======================================================
// ERROR HANDLING (MUST BE LAST)
// ======================================================
app.use(notFound);
app.use(errorHandler);


// ======================================================
// SERVER START
// ======================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥Swiggy Server running on port ${PORT}`);
});