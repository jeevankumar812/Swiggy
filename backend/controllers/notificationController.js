// controllers/notificationController.js

// Dummy in-memory notifications
let notifications = [];


// ======================================================
// @desc Order Placed Notification
// ======================================================
export const sendOrderPlacedNotification = async (req, res) => {
  try {
    const msg = "Your order has been placed successfully";

    notifications.push({ user: req.user._id, message: msg });

    res.status(200).json({ success: true, message: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Order Status Notification
// ======================================================
export const sendOrderStatusNotification = async (req, res) => {
  try {
    const { status } = req.body;

    const msg = `Your order status is ${status}`;

    notifications.push({ user: req.user._id, message: msg });

    res.status(200).json({ success: true, message: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Payment Success Notification
// ======================================================
export const sendPaymentSuccessNotification = async (req, res) => {
  try {
    const msg = "Payment successful";

    notifications.push({ user: req.user._id, message: msg });

    res.status(200).json({ success: true, message: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Promotional Notification
// ======================================================
export const sendPromotionalNotification = async (req, res) => {
  try {
    const { message } = req.body;

    notifications.push({ message });

    res.status(200).json({ success: true, message: "Promo sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ======================================================
// @desc Get My Notifications
// ======================================================
export const getMyNotifications = async (req, res) => {
  try {
    const userNotes = notifications.filter(
      n => n.user?.toString() === req.user._id.toString()
    );

    res.status(200).json({ success: true, notifications: userNotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};