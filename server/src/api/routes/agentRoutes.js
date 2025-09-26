const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { protect, authorize } = require('../middleware/auth');

// Agent dashboard routes - agent accesses their own data
// @route   GET /api/v1/agent/dashboard
// @desc    Get logged-in agent dashboard data  
// @access  Private
router.get('/dashboard', protect, agentController.getAgentDashboard);

// @route   GET /api/v1/agent/analytics  
// @desc    Get logged-in agent analytics data
// @access  Private
router.get('/analytics', protect, agentController.getAgentAnalytics);

// @route   GET /api/v1/agent/leads
// @desc    Get logged-in agent leads/contacts
// @access  Private
router.get('/leads', protect, agentController.getAgentLeads);

// @route   GET /api/v1/agent/properties
// @desc    Get properties managed by logged-in agent
// @access  Private
router.get('/properties', protect, agentController.getAgentProperties);

// Admin routes - admin can access any agent's data by specifying agentId
// @route   GET /api/v1/agent/:agentId/dashboard
// @desc    Get specific agent dashboard data (admin only)
// @access  Private (admin only)
router.get('/:agentId/dashboard', protect, authorize('admin'), agentController.getAgentDashboard);

// @route   GET /api/v1/agent/:agentId/analytics  
// @desc    Get specific agent analytics data (admin only)
// @access  Private (admin only)
router.get('/:agentId/analytics', protect, authorize('admin'), agentController.getAgentAnalytics);

// @route   GET /api/v1/agent/:agentId/leads
// @desc    Get specific agent leads/contacts (admin only)
// @access  Private (admin only)
router.get('/:agentId/leads', protect, authorize('admin'), agentController.getAgentLeads);

// @route   GET /api/v1/agent/:agentId/properties
// @desc    Get properties managed by specific agent (admin only)
// @access  Private (admin only)
router.get('/:agentId/properties', protect, authorize('admin'), agentController.getAgentProperties);

module.exports = router;