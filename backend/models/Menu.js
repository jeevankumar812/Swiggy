import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    // ======================================================
    // RESTAURANT REFERENCE
    // ======================================================

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // ======================================================
    // FOOD DETAILS
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
    // PRICE
    // ======================================================

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
    },

    // ======================================================
    // CATEGORY
    // ======================================================

    category: {
      type: String,
      enum: [
        "VEG",
        "NON-VEG",
        "DRINKS",
        "DESSERT",
      ],
      required: true,
    },

    // ======================================================
    // FOOD IMAGE
    // ======================================================

    image: {
      type: String,
      default: "",
    },

    // ======================================================
    // FOOD STATUS
    // ======================================================

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

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
    // EXTRA DETAILS
    // ======================================================

    preparationTime: {
      type: Number,
      default: 15,
    },

    calories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);