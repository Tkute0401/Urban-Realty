const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const propertyController = require('../controllers/propertyController');
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Public
router.get('/', propertyController.getProperties);

// @desc    Get featured properties
// @route   GET /api/v1/properties/featured
// @access  Public
router.get('/featured', propertyController.getFeaturedProperties);

// @desc    Get properties within radius
// @route   GET /api/v1/properties/radius/:zipcode/:distance
// @access  Public
router.get('/radius/:zipcode/:distance', propertyController.getPropertiesInRadius);

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
router.get('/:id', propertyController.getProperty);

// @desc    Create contact request for property
// @route   POST /api/v1/properties/:id/contact
// @access  Private
router.post(
  '/:id/contact',
  protect,
  [
    check('message', 'Message is required').not().isEmpty(),
    check('contactMethod', 'Valid contact method is required').isIn(['message', 'email', 'whatsapp', 'call'])
  ],
  contactController.createContactRequest
);

// @desc    Create property
// @route   POST /api/v1/properties
// @access  Private (Agent/Admin)
router.post(
  '/',
  [
    protect,
    authorize('agent', 'admin'),
    upload.array('images', 10),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['House', 'Apartment', 'Villa', 'Condo', 'Land']),
      check('status', 'Status is required').isIn(['For Sale', 'For Rent', 'Sold']),
      check('price', 'Price must be a number').isNumeric(),
      check('bedrooms', 'Bedrooms must be a number').isNumeric(),
      check('bathrooms', 'Bathrooms must be a number').isNumeric(),
      check('area', 'Area must be a number').isNumeric(),
      check('address', 'Address is required').exists()
    ]
  ],
  propertyController.createProperty
);

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Agent/Admin)
router.put(
  '/:id',
  [
    protect,
    authorize('agent', 'admin'),
    upload.array('images', 10),
    [
      check('title', 'Title is required').optional().not().isEmpty(),
      check('description', 'Description is required').optional().not().isEmpty(),
      check('type', 'Type is required').optional().isIn(['House', 'Apartment', 'Villa', 'Condo', 'Land']),
      check('status', 'Status is required').optional().isIn(['For Sale', 'For Rent', 'Sold']),
      check('price', 'Price must be a number').optional().isNumeric(),
      check('bedrooms', 'Bedrooms must be a number').optional().isNumeric(),
      check('bathrooms', 'Bathrooms must be a number').optional().isNumeric(),
      check('area', 'Area must be a number').optional().isNumeric()
    ]
  ],
  propertyController.updateProperty
);

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Agent/Admin)
router.delete(
  '/:id',
  [protect, authorize('agent', 'admin')],
  propertyController.deleteProperty
);

// @desc    Upload property photo
// @route   PUT /api/v1/properties/:id/photo
// @access  Private (Agent/Admin)
router.put(
  '/:id/photo',
  [protect, authorize('agent', 'admin'), upload.single('file')],
  propertyController.uploadPropertyPhoto
);

module.exports = router;