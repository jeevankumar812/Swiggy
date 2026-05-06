// controllers/couponController.js

// Dummy in-memory store
let coupons = [];


// ======================================================
// @desc Create Coupon
// ======================================================
export const createCoupon = async (req, res) => {
  try {
    const { code, discount } = req.body;

    const coupon = { code, discount, active: true };
    coupons.push(coupon);

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Validate Coupon
// ======================================================
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = coupons.find(c => c.code === code && c.active);

    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon" });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Apply Coupon
// ======================================================
export const applyCouponToCart = async (req, res) => {
  try {
    const { code, total } = req.body;

    const coupon = coupons.find(c => c.code === code && c.active);

    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid coupon" });
    }

    const discounted = total - (total * coupon.discount) / 100;

    res.status(200).json({
      success: true,
      discountedTotal: discounted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Disable Coupon
// ======================================================
export const disableCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = coupons.find(c => c.code === code);

    if (coupon) coupon.active = false;

    res.status(200).json({ success: true, message: "Coupon disabled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get All Coupons
// ======================================================
export const getAllCoupons = async (req, res) => {
  try {
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};