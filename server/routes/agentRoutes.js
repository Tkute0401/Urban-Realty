const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { protect, authorize } = require('../middleware/auth');

// Agent self-access endpoints (logged-in agent accessing their own data)
router.get('/dashboard', protect, authorize('agent', 'admin'), agentController.getDashboard);
router.get('/analytics', protect, authorize('agent', 'admin'), agentController.getAnalytics);
router.get('/leads', protect, authorize('agent', 'admin'), agentController.getLeads);
router.get('/properties', protect, authorize('agent', 'admin'), agentController.getProperties);
router.get('/projects', protect, authorize('agent', 'admin'), agentController.getProjects);

// Admin endpoints for accessing any agent's data (admin only)
router.get('/:agentId/dashboard', protect, authorize('admin'), agentController.getAdminDashboard);
router.get('/:agentId/analytics', protect, authorize('admin'), agentController.getAdminAnalytics);
router.get('/:agentId/leads', protect, authorize('admin'), agentController.getAdminLeads);
router.get('/:agentId/properties', protect, authorize('admin'), agentController.getAdminProperties);

module.exports = router;
