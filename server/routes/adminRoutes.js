// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Admin dashboard stats
router.get('/stats', protect, authorize('admin'), adminController.getStats);

// User management
router.get('/users', protect, authorize('admin'), adminController.getUsers);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

// Property management
router.get('/properties', protect, authorize('admin'), adminController.getProperties);
router.put('/properties/:id', protect, authorize('admin'), adminController.updateProperty);
router.delete('/properties/:id', protect, authorize('admin'), adminController.deleteProperty);

// Contact management
router.get('/contacts', protect, authorize('admin'), adminController.getContacts);
router.delete('/contacts/:id', protect, authorize('admin'), adminController.deleteContact);

module.exports = router;