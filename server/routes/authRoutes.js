const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['buyer', 'individual_seller', 'agent', 'developer', 'admin']),
    check('mobile', 'Please include a valid mobile number').optional().matches(/^\+?[0-9]{10,15}$/),
    check('reraId', 'RERA ID is required for agent and developer').if((value, { req }) => ['agent', 'developer'].includes(req.body.role)).not().isEmpty()
  ],
  authController.register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

router.get('/me', protect, authController.getMe);

router.put(
  '/update',
  protect,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('mobile', 'Please include a valid mobile number').optional().matches(/^\+?[0-9]{10,15}$/),
    check('role', 'Invalid role').optional().isIn(['buyer', 'agent', 'admin', 'painter', 'interior_designer', 'lawyer'])
  ],
  authController.updateUser
);
// Favorites routes
router.route('/favorites/:propertyId')
  .put(protect, authController.toggleFavorite)
  .delete(protect, authController.removeFromFavorites);

// Add these routes to your auth routes file
router.route('/favorites/:propertyId/status')
  .get(protect, authController.checkFavoriteStatus);  

router.get('/favorites', protect, authController.getFavorites);

// Project favorites routes
router.route('/project-favorites/:projectId')
  .put(protect, authController.toggleProjectFavorite);

router.route('/project-favorites/:projectId/status')
  .get(protect, authController.checkProjectFavoriteStatus);

router.get('/project-favorites', protect, authController.getProjectFavorites);

// Recently viewed routes
router.route('/recently-viewed/:propertyId')
  .post(protect, authController.addToRecentlyViewed);

router.get('/recently-viewed', protect, authController.getRecentlyViewed);

module.exports = router;