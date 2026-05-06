// routes/supportRoutes.js

import express from "express";
import {
  createTicket,
  getMyTickets,
  replyTicket,
  closeTicket,
  getAllTickets,
} from "../controllers/supportController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import asyncHandler from "../middlewares/asyncHandler.js";
const router = express.Router();

router.post("/", protect, asyncHandler(createTicket));
router.get("/my", protect, asyncHandler(getMyTickets));
router.post("/reply/:id", protect, asyncHandler(replyTicket));
router.put("/close/:id", protect, asyncHandler(closeTicket));

// ADMIN
router.get("/", protect, adminOnly, asyncHandler(getAllTickets));

export default router;