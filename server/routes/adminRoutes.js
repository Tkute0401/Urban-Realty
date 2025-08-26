const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const dynamicFieldController = require('../controllers/dynamicFieldController');
const userTypeController = require('../controllers/userTypeController');
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/multer');
const {
  requireAdminAccess,
  requireCRM,
  requireTeamManagement,
  requireAdvancedAnalytics,
  requireCustomizationAccess,
  requireBulkOperations
} = require('../middleware/subscriptionAccess');

// User management
router.get('/users', [protect, authorize('admin'), requireAdminAccess], adminController.getUsers);
router.get('/users/:id', [protect, authorize('admin'), requireAdminAccess], adminController.getUser);
router.put('/users/:id', [protect, authorize('admin'), requireAdminAccess], adminController.updateUser);
router.delete('/users/:id', [protect, authorize('admin'), requireAdminAccess], adminController.deleteUser);

// Property management
router.get('/properties', [protect, authorize('admin'), requireAdminAccess], adminController.getProperties);
router.get('/properties/:id', [protect, authorize('admin'), requireAdminAccess], adminController.getProperty);
router.delete('/properties/:id', [protect, authorize('admin'), requireAdminAccess], adminController.deleteProperty);

// Agent management
router.get('/agents', [protect, authorize('admin'), requireTeamManagement], adminController.getAgents);
router.get('/agents/:id', [protect, authorize('admin'), requireTeamManagement], adminController.getAgent);
router.put('/agents/:id/verify', [protect, authorize('admin'), requireTeamManagement], adminController.verifyAgent);

// Contact requests
router.get('/contacts', [protect, authorize('admin'), requireCRM], adminController.getContactRequests);
router.get('/contacts/:id', [protect, authorize('admin'), requireCRM], adminController.getContactRequest);
router.delete('/contacts/:id', [protect, authorize('admin'), requireCRM], adminController.deleteContactRequest);

// Statistics
router.get('/stats', [protect, authorize('admin'), requireAdvancedAnalytics], adminController.getStats);

// Dynamic Fields Management
router.get('/fields', [protect, authorize('admin'), requireCustomizationAccess], dynamicFieldController.getFields);
router.get('/fields/:entityType', [protect, authorize('admin'), requireCustomizationAccess], dynamicFieldController.getFieldsByEntity);
router.post('/fields', [protect, authorize('admin'), requireCustomizationAccess], dynamicFieldController.createField);
router.put('/fields/:id', [protect, authorize('admin'), requireCustomizationAccess], dynamicFieldController.updateField);
router.delete('/fields/:id', [protect, authorize('admin'), requireCustomizationAccess], dynamicFieldController.deleteField);
router.put('/fields/reorder', [protect, authorize('admin'), requireCustomizationAccess], dynamicFieldController.reorderFields);

// User Types Management
router.get('/user-types', [protect, authorize('admin'), requireCustomizationAccess], userTypeController.getUserTypes);
router.get('/user-types/:id', [protect, authorize('admin'), requireCustomizationAccess], userTypeController.getUserType);
router.post('/user-types', [protect, authorize('admin'), requireCustomizationAccess], userTypeController.createUserType);
router.put('/user-types/:id', [protect, authorize('admin'), requireCustomizationAccess], userTypeController.updateUserType);
router.delete('/user-types/:id', [protect, authorize('admin'), requireCustomizationAccess], userTypeController.deleteUserType);

// Media Management (Admin can delete any media)
router.delete('/media/:id', [protect, authorize('admin'), requireAdminAccess], mediaController.deleteMedia);

// Access Control Management
router.get('/access-violations', [protect, authorize('admin'), requireAdminAccess], adminController.getAccessViolations);
router.put('/access-violations/:id', [protect, authorize('admin'), requireAdminAccess], adminController.handleAccessViolation);
router.get('/subscription-analytics', [protect, authorize('admin'), requireAdvancedAnalytics], adminController.getSubscriptionAnalytics);

// User Management with Subscription Control
router.put('/users/:id/subscription', [protect, authorize('admin'), requireAdminAccess], adminController.updateUserSubscription);
router.get('/users/:id/subscription-history', [protect, authorize('admin'), requireAdminAccess], adminController.getUserSubscriptionHistory);

module.exports = router;