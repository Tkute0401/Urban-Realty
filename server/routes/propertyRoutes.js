// server/routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const propertyController = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multer'); // Import the configured Multer instance

// Public routes
router.get('/', propertyController.getProperties);
router.delete('/:id', propertyController.deleteProperty);

// Add this with the other routes
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/:id', propertyController.getProperty);
router.get('/radius/:zipcode/:distance', propertyController.getPropertiesInRadius);

// Protected routes
// propertyRoutes.js
router.post(
  '/',
  [
    protect,
    upload.array('images', 10), // Multer first
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



router.put(
  '/:id',
  [
    protect, // Authentication first
    upload.array('images', 10), // Then handle file uploads
    [
      check('address', 'Address is required').custom(value => {
        try {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value;
          return typeof parsed === 'object' && parsed !== null;
        } catch {
          return false;
        }
      }),
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



router.put(
  '/:id/photo',
  [
    protect,
    upload.single('file') // Handle single file upload
  ],
  propertyController.uploadPropertyPhoto
);

module.exports = router;