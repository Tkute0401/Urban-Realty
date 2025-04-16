const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const dynamicFieldController = require('../controllers/dynamicFieldController');
const userTypeController = require('../controllers/userTypeController');
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/multer');

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

// Dynamic Fields Management
router.get('/fields', protect, authorize('admin'), dynamicFieldController.getFields);
router.get('/fields/:entityType', protect, authorize('admin'), dynamicFieldController.getFieldsByEntity);
router.post('/fields', protect, authorize('admin'), dynamicFieldController.createField);
router.put('/fields/:id', protect, authorize('admin'), dynamicFieldController.updateField);
router.delete('/fields/:id', protect, authorize('admin'), dynamicFieldController.deleteField);
router.put('/fields/reorder', protect, authorize('admin'), dynamicFieldController.reorderFields);

// User Types Management
router.get('/user-types', protect, authorize('admin'), userTypeController.getUserTypes);
router.get('/user-types/:id', protect, authorize('admin'), userTypeController.getUserType);
router.post('/user-types', protect, authorize('admin'), userTypeController.createUserType);
router.put('/user-types/:id', protect, authorize('admin'), userTypeController.updateUserType);
router.delete('/user-types/:id', protect, authorize('admin'), userTypeController.deleteUserType);

// Media Management (Admin can delete any media)
router.delete('/media/:id', protect, authorize('admin'), mediaController.deleteMedia);

module.exports = router;