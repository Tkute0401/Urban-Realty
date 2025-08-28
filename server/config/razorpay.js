const Razorpay = require('razorpay');

// Initialize Razorpay instance (only if credentials are available)
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Validate Razorpay configuration
const validateRazorpayConfig = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️  Razorpay configuration incomplete. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
    return false;
  }
  return true;
};

module.exports = {
  razorpay,
  validateRazorpayConfig
};