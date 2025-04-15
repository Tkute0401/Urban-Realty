const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['buyer', 'agent', 'admin']),
    check('mobile', 'Please include a valid mobile number')
      .optional()
      .matches(/^\+?[0-9]{10,15}$/)
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.get('/me', protect, getMe);

router.put(
  '/updatedetails',
  protect,
  [
    check('name', 'Name is required').optional().not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').optional().isEmail().normalizeEmail(),
    check('mobile', 'Please include a valid mobile number')
      .optional()
      .matches(/^\+?[0-9]{10,15}$/)
  ],
  updateDetails
);

router.put(
  '/updatepassword',
  protect,
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be 6+ characters').isLength({ min: 6 })
  ],
  updatePassword
);

router.post(
  '/forgotpassword',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail()
  ],
  forgotPassword
);

router.put(
  '/resetpassword/:resettoken',
  [
    check('password', 'Password must be 6+ characters').isLength({ min: 6 })
  ],
  resetPassword
);

router.get('/verifyemail/:token', verifyEmail);

module.exports = router;