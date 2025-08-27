const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const dynamicFieldController = require('../controllers/dynamicFieldController');
const userTypeController = require('../controllers/userTypeController');
const mediaController = require('../controllers/mediaController');
const subscriptionController = require('../controllers/subscriptionController');
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
router.get('/dashboard-stats', protect, authorize('admin'), adminController.getDashboardStats);

// Subscription Management
router.get('/subscription-plans', protect, authorize('admin'), subscriptionController.getSubscriptions);
router.post('/subscription-plans', protect, authorize('admin'), subscriptionController.createSubscription);
router.put('/subscription-plans/:id', protect, authorize('admin'), subscriptionController.updateSubscription);
router.delete('/subscription-plans/:id', protect, authorize('admin'), subscriptionController.deleteSubscription);

// User Subscriptions
router.get('/subscriptions', protect, authorize('admin'), async (req, res) => {
  try {
    const UserSubscription = require('../models/UserSubscription');
    const subscriptions = await UserSubscription.find()
      .populate('user', 'name email')
      .populate('subscription', 'name type price')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscriptions'
    });
  }
});

router.get('/subscriptions/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const UserSubscription = require('../models/UserSubscription');
    const subscription = await UserSubscription.findById(req.params.id)
      .populate('user', 'name email')
      .populate('subscription', 'name type price');
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription'
    });
  }
});

// Subscription Analytics
router.get('/subscription-analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const UserSubscription = require('../models/UserSubscription');
    const Subscription = require('../models/Subscription');
    
    const [totalSubscriptions, activeSubscriptions, revenueData, planDistribution] = await Promise.all([
      UserSubscription.countDocuments(),
      UserSubscription.countDocuments({ status: 'active' }),
      UserSubscription.aggregate([
        { $match: { status: 'active', paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      UserSubscription.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$subscription', count: { $sum: 1 } } },
        { $lookup: { from: 'subscriptions', localField: '_id', foreignField: '_id', as: 'plan' } },
        { $unwind: '$plan' }
      ])
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalSubscriptions,
        activeSubscriptions,
        monthlyRevenue: revenueData[0]?.total || 0,
        planDistribution: planDistribution.map(plan => ({
          name: plan.plan.name,
          count: plan.count,
          percentage: Math.round((plan.count / activeSubscriptions) * 100)
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription analytics'
    });
  }
});

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

// System Monitoring
router.get('/system-status', protect, authorize('admin'), async (req, res) => {
  try {
    const os = require('os');
    const process = require('process');
    
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      cpuUsage: os.loadavg(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem()
    };
    
    res.status(200).json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system status'
    });
  }
});

// Backup Management
router.post('/backup', protect, authorize('admin'), async (req, res) => {
  try {
    // This would typically trigger a database backup process
    res.status(200).json({
      success: true,
      message: 'Backup process initiated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to initiate backup'
    });
  }
});

// Log Management
router.get('/logs', protect, authorize('admin'), async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // This is a simplified log viewer - in production you'd want proper log management
    const logDir = path.join(__dirname, '../logs');
    const logFiles = await fs.readdir(logDir);
    
    res.status(200).json({
      success: true,
      data: {
        logFiles,
        message: 'Log files retrieved successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs'
    });
  }
});

module.exports = router;