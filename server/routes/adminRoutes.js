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
router.get('/properties/stats', protect, authorize('admin'), adminController.getPropertyStats);
router.get('/properties/:id', protect, authorize('admin'), adminController.getProperty);
router.delete('/properties/:id', protect, authorize('admin'), adminController.deleteProperty);

// Agent management
router.get('/agents', protect, authorize('admin'), adminController.getAgents);
router.get('/agents/:id', protect, authorize('admin'), adminController.getAgent);
router.put('/agents/:id/verify', protect, authorize('admin'), adminController.verifyAgent);

// Contact requests
router.get('/contacts', protect, authorize('admin'), adminController.getContactRequests);
router.get('/contacts/stats', protect, authorize('admin'), adminController.getContactStats);
router.get('/contacts/:id', protect, authorize('admin'), adminController.getContactRequest);
router.delete('/contacts/:id', protect, authorize('admin'), adminController.deleteContactRequest);

// Statistics
router.get('/stats', protect, authorize('admin'), adminController.getStats);

// Analytics
router.get('/analytics', protect, authorize('admin'), adminController.getAnalytics);

// Reports
router.get('/reports', protect, authorize('admin'), adminController.getReports);
router.get('/reports/export', protect, authorize('admin'), adminController.exportReport);
router.post('/reports/email', protect, authorize('admin'), adminController.emailReport);

// Settings
router.get('/settings', protect, authorize('admin'), adminController.getSettings);
router.put('/settings', protect, authorize('admin'), adminController.updateSettings);

// Backup and Restore
router.post('/backup', protect, authorize('admin'), adminController.createBackup);
router.post('/restore/:id', protect, authorize('admin'), adminController.restoreBackup);

// System Health & Monitoring
router.get('/system/health', protect, authorize('admin'), adminController.getSystemHealth);
router.post('/system/services/:id/:action', protect, authorize('admin'), adminController.serviceAction);

// API Management
router.get('/api/keys', protect, authorize('admin'), adminController.getAPIKeys);
router.post('/api/keys', protect, authorize('admin'), adminController.createAPIKey);
router.put('/api/keys/:id', protect, authorize('admin'), adminController.updateAPIKey);
router.delete('/api/keys/:id', protect, authorize('admin'), adminController.deleteAPIKey);
router.get('/api/endpoints', protect, authorize('admin'), adminController.getAPIEndpoints);
router.get('/api/usage', protect, authorize('admin'), adminController.getAPIUsage);

// Database Management
router.get('/database/stats', protect, authorize('admin'), adminController.getDatabaseStats);
router.get('/database/collections', protect, authorize('admin'), adminController.getDatabaseCollections);
router.get('/database/queries', protect, authorize('admin'), adminController.getDatabaseQueries);
router.post('/database/query', protect, authorize('admin'), adminController.executeQuery);
router.get('/database/backups', protect, authorize('admin'), adminController.getDatabaseBackups);
router.post('/database/backup', protect, authorize('admin'), adminController.createDatabaseBackup);
router.post('/database/restore/:id', protect, authorize('admin'), adminController.restoreDatabaseBackup);
router.post('/database/optimize', protect, authorize('admin'), adminController.optimizeDatabase);

// Security & Audit
router.get('/security/overview', protect, authorize('admin'), adminController.getSecurityOverview);
router.get('/security/audit-logs', protect, authorize('admin'), adminController.getAuditLogs);
router.get('/security/threats', protect, authorize('admin'), adminController.getSecurityThreats);
router.get('/security/settings', protect, authorize('admin'), adminController.getSecuritySettings);
router.post('/security/:action', protect, authorize('admin'), adminController.securityAction);

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