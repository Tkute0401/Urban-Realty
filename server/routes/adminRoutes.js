const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getProperties,
  getProperty,
  deleteProperty,
  getContactRequests,
  getStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// User Management
router.get('/users', protect, authorize('admin'), getUsers);

router.post(
  '/users',
  protect,
  authorize('admin'),
  [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['buyer', 'agent', 'admin'])
  ],
  createUser
);

router.get('/users/:id', protect, authorize('admin'), getUser);

router.put(
  '/users/:id',
  protect,
  authorize('admin'),
  [
    check('name', 'Name is required').optional().not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').optional().isEmail().normalizeEmail(),
    check('role', 'Invalid role').optional().isIn(['buyer', 'agent', 'admin'])
  ],
  updateUser
);

router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Property Management
router.get('/properties', protect, authorize('admin'), getProperties);
router.get('/properties/:id', protect, authorize('admin'), getProperty);
router.delete('/properties/:id', protect, authorize('admin'), deleteProperty);

// Contact Management
router.get('/contacts', protect, authorize('admin'), getContactRequests);

// Statistics
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;