// Analytics API routes for dashboard and reporting

const express = require('express');
const router = express.Router();
const analyticsService = require('../../services/analyticsService');
const { protect, authorize } = require('../middleware/auth');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../../../constants');

// Get dashboard analytics (admin only)
router.get('/dashboard', protect, authorize(['admin']), async (req, res) => {
  try {
    const analytics = analyticsService.getDashboardAnalytics();
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(analytics, 'Dashboard analytics retrieved successfully'));
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve dashboard analytics')
    );
  }
});

// Get user analytics
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req;
    
    // Users can only view their own analytics, admins can view any
    if (user.role !== 'admin' && user.id !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }
    
    const userAnalytics = analyticsService.getUserAnalytics(userId);
    if (!userAnalytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('User analytics not found')
      );
    }
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(userAnalytics, 'User analytics retrieved successfully'));
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve user analytics')
    );
  }
});

// Get property analytics
router.get('/property/:propertyId', protect, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { user } = req;
    
    // Check if user has access to this property
    // This would typically involve checking if the user owns the property or is an admin
    // For now, we'll allow all authenticated users
    
    const propertyAnalytics = analyticsService.getPropertyAnalytics(propertyId);
    if (!propertyAnalytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('Property analytics not found')
      );
    }
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(propertyAnalytics, 'Property analytics retrieved successfully'));
  } catch (error) {
    console.error('Property analytics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve property analytics')
    );
  }
});

// Get search analytics
router.get('/search', protect, authorize(['admin']), async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    const searchAnalytics = analyticsService.getSearchAnalytics(timeframe);
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(searchAnalytics, 'Search analytics retrieved successfully'));
  } catch (error) {
    console.error('Search analytics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve search analytics')
    );
  }
});

// Get system metrics
router.get('/system', protect, authorize(['admin']), async (req, res) => {
  try {
    const systemMetrics = analyticsService.getSystemMetrics();
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(systemMetrics, 'System metrics retrieved successfully'));
  } catch (error) {
    console.error('System metrics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve system metrics')
    );
  }
});

// Track user action
router.post('/track', protect, async (req, res) => {
  try {
    const { action, data } = req.body;
    const { user } = req;
    
    if (!action) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Action is required')
      );
    }
    
    let trackingId;
    
    switch (action) {
      case 'page_view':
        trackingId = analyticsService.trackPageView(user.id, data);
        break;
      case 'property_interaction':
        trackingId = analyticsService.trackPropertyInteraction(user.id, data.propertyId, data.type, data);
        break;
      case 'search':
        trackingId = analyticsService.trackSearchQuery(user.id, data);
        break;
      case 'conversion':
        trackingId = analyticsService.trackConversion(user.id, data);
        break;
      default:
        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          createErrorResponse('Invalid action type')
        );
    }
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(
      { trackingId },
      'Action tracked successfully'
    ));
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to track action')
    );
  }
});

// Get analytics export
router.get('/export', protect, authorize(['admin']), async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const data = analyticsService.exportAnalytics(format);
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      return res.send(data);
    }
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(data, 'Analytics data exported successfully'));
  } catch (error) {
    console.error('Export error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to export analytics data')
    );
  }
});

// Get real-time metrics
router.get('/realtime', protect, authorize(['admin']), async (req, res) => {
  try {
    const realtimeMetrics = {
      timestamp: new Date().toISOString(),
      activeUsers: analyticsService.metrics.users.size,
      activeSessions: Array.from(analyticsService.metrics.users.values())
        .filter(user => user.currentSession).length,
      recentErrors: Array.from(analyticsService.metrics.errors.values())
        .filter(error => {
          const errorTime = new Date(error.timestamp);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          return errorTime > fiveMinutesAgo;
        }).length,
      systemHealth: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        cpu: process.cpuUsage()
      }
    };
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(realtimeMetrics, 'Real-time metrics retrieved successfully'));
  } catch (error) {
    console.error('Real-time metrics error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve real-time metrics')
    );
  }
});

// Get user behavior insights
router.get('/insights/user/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req;
    
    // Users can only view their own insights, admins can view any
    if (user.role !== 'admin' && user.id !== userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied')
      );
    }
    
    const userAnalytics = analyticsService.getUserAnalytics(userId);
    if (!userAnalytics) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('User insights not found')
      );
    }
    
    // Generate insights
    const insights = {
      userId,
      behavior: {
        mostViewedPages: userAnalytics.topPages,
        conversionRate: userAnalytics.conversionRate,
        engagement: userAnalytics.totalViews > 10 ? 'high' : 'low',
        lastActive: userAnalytics.lastActive
      },
      recommendations: generateUserRecommendations(userAnalytics),
      trends: {
        activityTrend: 'increasing', // Placeholder
        interestAreas: ['apartments', 'villas'], // Placeholder
        preferredPriceRange: '5M-10M' // Placeholder
      }
    };
    
    res.status(HTTP_STATUS.OK).json(createSuccessResponse(insights, 'User insights retrieved successfully'));
  } catch (error) {
    console.error('User insights error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to retrieve user insights')
    );
  }
});

// Helper function to generate user recommendations
function generateUserRecommendations(userAnalytics) {
  const recommendations = [];
  
  if (userAnalytics.totalViews < 5) {
    recommendations.push('Explore more properties to get personalized recommendations');
  }
  
  if (userAnalytics.conversionRate < 5) {
    recommendations.push('Consider saving properties to your favorites for easy access');
  }
  
  if (userAnalytics.topPages.length > 0) {
    const topPage = userAnalytics.topPages[0];
    recommendations.push(`You seem interested in ${topPage.page} - check out similar properties`);
  }
  
  return recommendations;
}

module.exports = router;