const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createContactRequest,
  getMyContactRequests,
  getContactRequest,
  updateContactRequest,
  deleteContactRequest
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post(
  '/',
  protect,
  [
    check('propertyId', 'Property ID is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty().trim().escape(),
    check('contactMethod', 'Valid contact method is required')
      .isIn(['message', 'email', 'whatsapp', 'call'])
  ],
  createContactRequest
);

router.get('/', protect, getMyContactRequests);

router.get('/:id', protect, getContactRequest);

router.put(
  '/:id',
  protect,
  [
    check('status', 'Valid status is required')
      .optional()
      .isIn(['pending', 'contacted', 'completed', 'spam'])
  ],
  updateContactRequest
);

router.delete('/:id', protect, deleteContactRequest);

module.exports = router;