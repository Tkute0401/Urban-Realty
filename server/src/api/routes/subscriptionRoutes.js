const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const subscriptionController = require('../../../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');
const paymentController = require('../../../controllers/paymentController');

// Public routes
router.get('/', subscriptionController.getSubscriptions);

// Protected routes
router.use(protect);

// User subscription routes - specific routes must come before parameterized routes
router.get('/my-subscription', subscriptionController.getMySubscription);
router.get('/check-feature/:feature', subscriptionController.checkFeatureAccess);
router.get('/listing-limit', subscriptionController.checkListingLimit);
router.get('/billing-history', subscriptionController.getBillingHistory);
router.get('/upcoming-billing', subscriptionController.getUpcomingBilling);
router.post('/subscribe', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty(),
  check('billingCycle', 'Billing cycle must be monthly or yearly').isIn(['monthly', 'yearly']),
  check('paymentMethod', 'Payment method is required').not().isEmpty()
], subscriptionController.subscribeUser);
router.put('/cancel', subscriptionController.cancelSubscription);
router.put('/payment-method', subscriptionController.updatePaymentMethod);

// Razorpay payment routes
router.get('/razorpay/key', paymentController.getRazorpayKey);
router.post('/razorpay/order', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty(),
  check('billingCycle', 'Billing cycle must be monthly or yearly').isIn(['monthly', 'yearly'])
], paymentController.createRazorpayOrder);
router.post('/razorpay/verify', paymentController.verifyRazorpayPayment);

// Parameterized routes - must come after specific routes
router.get('/:id', subscriptionController.getSubscription);

// Admin only routes
router.use(authorize('admin'));

router.post('/', [
  check('name', 'Subscription name is required').not().isEmpty(),
  check('type', 'Subscription type must be free, basic, premium, or enterprise').isIn(['free', 'basic', 'premium', 'enterprise']),
  check('price', 'Price must be a positive number').isFloat({ min: 0 }),
  check('billingCycle', 'Billing cycle must be monthly or yearly').isIn(['monthly', 'yearly'])
], subscriptionController.createSubscription);

router.put('/:id', [
  check('name', 'Subscription name is required').optional().not().isEmpty(),
  check('type', 'Subscription type must be free, basic, premium, or enterprise').optional().isIn(['free', 'basic', 'premium', 'enterprise']),
  check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
  check('billingCycle', 'Billing cycle must be monthly or yearly').optional().isIn(['monthly', 'yearly'])
], subscriptionController.updateSubscription);

router.delete('/:id', subscriptionController.deleteSubscription);

// Payment status update (admin only)
router.put('/:id/payment-status', [
  check('paymentStatus', 'Payment status must be paid, pending, failed, or refunded').isIn(['paid', 'pending', 'failed', 'refunded'])
], subscriptionController.updatePaymentStatus);

module.exports = router;

