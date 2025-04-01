const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const contactController = require('../controllers/contactController');

// Public routes (protected but available to all authenticated users)
router.post('/properties/:propertyId/contact', protect, contactController.createContactRequest);

// Agent-specific routes
router.get('/agent/contacts', protect, authorize('agent'), contactController.getAgentContactRequests);
router.put('/agent/contacts/:id', protect, authorize('agent'), contactController.updateContactRequest);

// Admin routes (already have these in adminRoutes)
// These can stay in adminRoutes or you can move them here for consistency

module.exports = router;