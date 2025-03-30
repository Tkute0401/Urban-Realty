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
    check('role', 'Role is required').isIn(['buyer', 'agent']),
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
  protect,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('mobile', 'Please include a valid mobile number').optional().matches(/^\+?[0-9]{10,15}$/),
    check('role', 'Invalid role').optional().isIn(['buyer', 'agent', 'admin'])
  ],
  authController.updateUser
);

module.exports = router;