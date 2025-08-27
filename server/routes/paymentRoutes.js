const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Authenticated routes
router.post('/checkout', protect, paymentController.createCheckoutSession);
router.get('/portal', protect, paymentController.createPortalSession);

// Stripe webhook (no auth, raw body parsed in server)
router.post('/webhook', paymentController.webhook);

module.exports = router;

