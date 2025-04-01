const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// User management
router.get('/users', protect, authorize('admin'), adminController.getUsers);
router.get('/users/:id', protect, authorize('admin'), adminController.getUser);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

// Property management
router.get('/properties', protect, authorize('admin'), adminController.getProperties);
router.get('/properties/:id', protect, authorize('admin'), adminController.getProperty);
router.delete('/properties/:id', protect, authorize('admin'), adminController.deleteProperty);

// Agent management
router.get('/agents', protect, authorize('admin'), adminController.getAgents);
router.get('/agents/:id', protect, authorize('admin'), adminController.getAgent);
router.put('/agents/:id/verify', protect, authorize('admin'), adminController.verifyAgent);

// Contact requests
router.get('/contacts', protect, authorize('admin'), adminController.getContactRequests);
router.get('/contacts/:id', protect, authorize('admin'), adminController.getContactRequest);
router.delete('/contacts/:id', protect, authorize('admin'), adminController.deleteContactRequest);

// Statistics
router.get('/stats', protect, authorize('admin'), adminController.getStats);

module.exports = router;