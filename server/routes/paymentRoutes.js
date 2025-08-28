const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/webhook', paymentController.webhookHandler);

// Protected routes
router.use(protect);

// Payment creation and verification
router.post('/create-order', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty(),
  check('billingCycle', 'Billing cycle must be monthly or yearly').isIn(['monthly', 'yearly'])
], paymentController.createOrder);

router.post('/verify', [
  check('razorpay_order_id', 'Razorpay order ID is required').not().isEmpty(),
  check('razorpay_payment_id', 'Razorpay payment ID is required').not().isEmpty(),
  check('razorpay_signature', 'Razorpay signature is required').not().isEmpty(),
  check('subscriptionId', 'Subscription ID is required').not().isEmpty()
], paymentController.verifyPayment);

// Payment status and management
router.get('/status/:subscriptionId', paymentController.getPaymentStatus);
router.post('/cancel/:subscriptionId', paymentController.cancelSubscription);

module.exports = router;