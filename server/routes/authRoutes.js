const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  requireFavoritesAccess,
  requireRecentlyViewedAccess,
  requireProfileAccess
} = require('../middleware/subscriptionAccess');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['buyer', 'agent', 'painter', 'interior_designer', 'lawyer']),
    check('mobile', 'Please include a valid mobile number').optional().matches(/^\+?[0-9]{10,15}$/)
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
  [protect, requireProfileAccess],
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
  .put([protect, requireFavoritesAccess], authController.addToFavorites)
  .delete([protect, requireFavoritesAccess], authController.removeFromFavorites);

// Add these routes to your auth routes file
router.route('/favorites/:propertyId/status')
  .get([protect, requireFavoritesAccess], authController.checkFavoriteStatus);

router.route('/favorites/:propertyId')
  .put([protect, requireFavoritesAccess], authController.toggleFavorite);  

router.get('/favorites', [protect, requireFavoritesAccess], authController.getFavorites);

// Recently viewed routes
router.route('/recently-viewed/:propertyId')
  .post([protect, requireRecentlyViewedAccess], authController.addToRecentlyViewed);

router.get('/recently-viewed', [protect, requireRecentlyViewedAccess], authController.getRecentlyViewed);

module.exports = router;