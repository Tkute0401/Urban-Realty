const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const {
  requireContactAccess,
  requireLeadManagement,
  requireCRM
} = require('../middleware/subscriptionAccess');

// @desc    Create contact request
// @route   POST /api/v1/contacts/property/:propertyId
// @access  Private
router.post(
  '/property/:propertyId',
  [protect, requireContactAccess],
  [
    check('message', 'Message is required').not().isEmpty(),
    check('contactMethod', 'Valid contact method is required').isIn(['message', 'email', 'whatsapp', 'call'])
  ],
  contactController.createContactRequest
);

// @desc    Get agent's contact requests
// @route   GET /api/v1/contacts/agent
// @access  Private/Agent
router.get(
  '/agent',
  [protect, authorize('agent'), requireLeadManagement],
  contactController.getAgentContactRequests
);

// @desc    Update contact request status
// @route   PUT /api/v1/contacts/:id
// @access  Private/Agent
router.put(
  '/:id',
  [protect, authorize('agent'), requireLeadManagement],
  [
    check('status', 'Valid status is required').isIn(['pending', 'contacted', 'followup', 'closed'])
  ],
  contactController.updateContactRequest
);

// @desc    Get all contact requests (Admin)
// @route   GET /api/v1/contacts
// @access  Private/Admin
router.get(
  '/',
  [protect, authorize('admin'), requireCRM],
  contactController.getContactRequests
);

// @desc    Delete contact request (Admin)
// @route   DELETE /api/v1/contacts/:id
// @access  Private/Admin
router.delete(
  '/:id',
  [protect, authorize('admin'), requireCRM],
  contactController.deleteContactRequest
);

module.exports = router;