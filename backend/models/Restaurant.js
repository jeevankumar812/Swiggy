import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    // ======================================================
    // BASIC DETAILS
    // ======================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ======================================================
    // IMAGES
    // ======================================================

    image: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    // ======================================================
    // LOCATION DETAILS
    // ======================================================

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    // ======================================================
    // CONTACT
    // ======================================================

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    // ======================================================
    // FOOD DETAILS
    // ======================================================

    cuisine: [
      {
        type: String,
      },
    ],

    // ======================================================
    // RATINGS
    // ======================================================

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // ======================================================
    // RESTAURANT STATUS
    // ======================================================

    isOpen: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // DELIVERY DETAILS
    // ======================================================

    deliveryTime: {
      type: Number,
      default: 30,
    },

    minimumOrderAmount: {
      type: Number,
      default: 100,
    },

    deliveryFee: {
      type: Number,
      default: 40,
    },

    // ======================================================
    // TIMINGS
    // ======================================================

    openingTime: {
      type: String,
      default: "09:00 AM",
    },

    closingTime: {
      type: String,
      default: "11:00 PM",
    },

    // ======================================================
    // OWNER
    // ======================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);