// server/routes/inquiryRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const inquiryController = require('../controllers/inquiryController');

// Public route to create inquiry
router.post('/', inquiryController.createInquiry);

// Protected routes
router.get('/my-inquiries', protect, inquiryController.getMyInquiries);
router.get('/:id', protect, inquiryController.getInquiry);

module.exports = router;