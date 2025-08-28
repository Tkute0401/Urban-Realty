const Razorpay = require('razorpay');
const crypto = require('crypto');

const createRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay environment variables missing: RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generatedSignature === signature;
};

module.exports = { createRazorpayInstance, verifyRazorpaySignature };

