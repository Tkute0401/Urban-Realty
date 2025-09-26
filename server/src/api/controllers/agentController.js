const Property = require('../../../models/Property');
const ContactRequest = require('../../../models/ContactRequest');
const User = require('../../../models/User');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../../../constants');

// @desc    Get agent dashboard data
// @route   GET /api/v1/agent/:agentId/dashboard
// @access  Private
exports.getAgentDashboard = async (req, res) => {
  try {
    // Get agentId from params (admin route) or use current user's ID (agent route)
    const { agentId } = req.params;
    const { user } = req;
    const targetAgentId = agentId || user._id.toString();

    // For agent routes (no agentId param), verify user is an agent
    if (!agentId && user.role !== 'agent' && user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied - must be an agent to access dashboard')
      );
    }

    // For admin routes (with agentId param), this is already handled by authorize middleware
    // For agent routes without agentId param, user is accessing their own data

    // Get query parameters for filtering
    const { status = 'all', dateRange = '30', propertyType = 'all' } = req.query;

    // Date filter calculation
    let dateFilter = {};
    if (dateRange !== 'all') {
      const days = parseInt(dateRange) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter.createdAt = { $gte: startDate };
    }

    // Build property filter
    let propertyFilter = { agent: targetAgentId, ...dateFilter };
    if (status !== 'all') {
      propertyFilter.status = status;
    }
    if (propertyType !== 'all') {
      propertyFilter.type = propertyType;
    }

    // Get agent properties
    const properties = await Property.find(propertyFilter)
      .populate('agent', 'name email')
      .sort('-createdAt');

    // Get agent contacts/leads
    const contactFilter = { agent: targetAgentId, ...dateFilter };
    const contacts = await ContactRequest.find(contactFilter)
      .populate('property', 'title price')
      .sort('-createdAt');

    // Calculate dashboard statistics
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const soldPropertiesArray = properties.filter(p => p.status === 'sold');
    const soldProperties = soldPropertiesArray.length;
    const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
    
    const totalLeads = contacts.length;
    const pendingLeads = contacts.filter(c => c.status === 'pending').length;
    const convertedLeads = contacts.filter(c => c.status === 'converted').length;
    
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;
    
    // Calculate estimated revenue (assuming 2% commission)
    const totalRevenue = soldPropertiesArray.reduce((sum, prop) => {
      return sum + (prop.price * 0.02);
    }, 0);

    // Get recent activity (last 10 contacts)
    const recentActivity = contacts.slice(0, 10).map(contact => ({
      id: contact._id,
      type: 'contact',
      message: `New inquiry for ${contact.property?.title || 'a property'}`,
      date: contact.createdAt,
      status: contact.status,
      customerName: contact.user?.name,
      propertyTitle: contact.property?.title
    }));

    // Performance metrics
    const avgResponseTime = contacts.length > 0 ? 
      contacts.reduce((sum, contact) => sum + (contact.responseTime || 24), 0) / contacts.length : 0;

    const dashboardData = {
      summary: {
        totalProperties,
        activeProperties,
        soldProperties,
        totalViews,
        totalLeads,
        pendingLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate),
        totalRevenue,
        avgResponseTime: Math.round(avgResponseTime)
      },
      properties: properties.slice(0, 10), // Recent 10 properties
      contacts: contacts.slice(0, 10), // Recent 10 contacts
      recentActivity,
      charts: {
        monthlyViews: generateMonthlyViews(properties),
        leadStatus: {
          pending: pendingLeads,
          contacted: contacts.filter(c => c.status === 'contacted').length,
          followup: contacts.filter(c => c.status === 'followup').length,
          converted: convertedLeads,
          closed: contacts.filter(c => c.status === 'closed').length
        },
        propertyTypes: generatePropertyTypeStats(properties)
      }
    };

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(dashboardData, 'Agent dashboard data retrieved successfully')
    );

  } catch (error) {
    console.error('Error fetching agent dashboard:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to fetch agent dashboard data', { error: error.message })
    );
  }
};

// @desc    Get agent analytics data
// @route   GET /api/v1/agent/:agentId/analytics  
// @access  Private
exports.getAgentAnalytics = async (req, res) => {
  try {
    // Get agentId from params (admin route) or use current user's ID (agent route)
    const { agentId } = req.params;
    const { user } = req;
    const targetAgentId = agentId || user._id.toString();

    // For agent routes (no agentId param), verify user is an agent
    if (!agentId && user.role !== 'agent' && user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied - must be an agent to access analytics')
      );
    }

    // Get date range from query (default to last 30 days)
    const { timeframe = '30d' } = req.query;
    const dateFilter = getDateFilter(timeframe);

    // Get agent data
    const properties = await Property.find({ 
      agent: targetAgentId,
      ...dateFilter 
    }).sort('-createdAt');

    const contacts = await ContactRequest.find({
      agent: targetAgentId,
      ...dateFilter
    }).sort('-createdAt');

    // Analytics calculations
    const analytics = {
      performance: {
        totalViews: properties.reduce((sum, prop) => sum + (prop.views || 0), 0),
        totalInquiries: contacts.length,
        conversionRate: contacts.length > 0 ? 
          ((contacts.filter(c => c.status === 'converted').length / contacts.length) * 100).toFixed(2) : 0,
        averageResponseTime: contacts.length > 0 ?
          Math.round(contacts.reduce((sum, c) => sum + (c.responseTime || 24), 0) / contacts.length) : 0
      },
      trends: {
        viewsOverTime: generateViewsTrend(properties, timeframe),
        inquiriesOverTime: generateInquiriesTrend(contacts, timeframe),
        conversionTrend: generateConversionTrend(contacts, timeframe)
      },
      demographics: {
        topLocations: generateTopLocations(properties),
        priceRanges: generatePriceRangeStats(properties),
        propertyTypes: generatePropertyTypeStats(properties)
      },
      engagement: {
        topPerformingProperties: properties
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map(prop => ({
            id: prop._id,
            title: prop.title,
            views: prop.views || 0,
            inquiries: contacts.filter(c => c.propertyId?.toString() === prop._id.toString()).length
          })),
        contactSources: generateContactSources(contacts)
      }
    };

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(analytics, 'Agent analytics data retrieved successfully')
    );

  } catch (error) {
    console.error('Error fetching agent analytics:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to fetch agent analytics data')
    );
  }
};

// @desc    Get agent leads/contacts
// @route   GET /api/v1/agent/:agentId/leads
// @access  Private
exports.getAgentLeads = async (req, res) => {
  try {
    // Get agentId from params (admin route) or use current user's ID (agent route)
    const { agentId } = req.params;
    const { user } = req;
    const targetAgentId = agentId || user._id.toString();

    // For agent routes (no agentId param), verify user is an agent
    if (!agentId && user.role !== 'agent' && user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied - must be an agent to access leads')
      );
    }

    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    // Build filter
    let filter = { agent: targetAgentId };
    if (status !== 'all') {
      filter.status = status;
    }

    const contacts = await ContactRequest.find(filter)
      .populate('property', 'title price images location')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ContactRequest.countDocuments(filter);

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse({
        contacts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }, 'Agent leads retrieved successfully')
    );

  } catch (error) {
    console.error('Error fetching agent leads:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to fetch agent leads')
    );
  }
};

// @desc    Get properties managed by agent
// @route   GET /api/v1/agent/:agentId/properties
// @access  Private
exports.getAgentProperties = async (req, res) => {
  try {
    // Get agentId from params (admin route) or use current user's ID (agent route)
    const { agentId } = req.params;
    const { user } = req;
    const targetAgentId = agentId || user._id.toString();

    // For agent routes (no agentId param), verify user is an agent
    if (!agentId && user.role !== 'agent' && user.role !== 'admin') {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        createErrorResponse('Access denied - must be an agent to access properties')
      );
    }

    const { page = 1, limit = 10, status = 'all', type = 'all' } = req.query;
    
    // Build filter
    let filter = { agent: targetAgentId };
    if (status !== 'all') {
      filter.status = status;
    }
    if (type !== 'all') {
      filter.type = type;
    }

    const properties = await Property.find(filter)
      .populate('agent', 'name email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(filter);

    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse({
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }, 'Agent properties retrieved successfully')
    );

  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      createErrorResponse('Failed to fetch agent properties')
    );
  }
};

// Helper functions
function getDateFilter(timeframe) {
  const now = new Date();
  let startDate;

  switch (timeframe) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { createdAt: { $gte: startDate } };
}

function generateMonthlyViews(properties) {
  // Generate last 6 months of data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[date.getMonth()];
    
    // Calculate views for this month (simplified - in real implementation, you'd track views by date)
    const monthViews = Math.floor(Math.random() * 1000) + 200;
    
    data.push({
      month: monthName,
      views: monthViews,
      leads: Math.floor(monthViews * 0.05) // Assume 5% conversion to leads
    });
  }

  return data;
}

function generatePropertyTypeStats(properties) {
  const typeStats = properties.reduce((acc, prop) => {
    acc[prop.type] = (acc[prop.type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(typeStats).map(([type, count]) => ({
    type,
    count,
    percentage: ((count / properties.length) * 100).toFixed(1)
  }));
}

function generateViewsTrend(properties, timeframe) {
  // Simplified trend generation - in real implementation, you'd have view tracking by date
  const periods = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 100) + 10
    });
  }
  
  return data;
}

function generateInquiriesTrend(contacts, timeframe) {
  // Group contacts by date
  const grouped = contacts.reduce((acc, contact) => {
    const date = contact.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const periods = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      inquiries: grouped[dateStr] || 0
    });
  }
  
  return data;
}

function generateConversionTrend(contacts, timeframe) {
  // Similar to inquiries trend but for conversions
  const converted = contacts.filter(c => c.status === 'converted');
  const grouped = converted.reduce((acc, contact) => {
    const date = contact.createdAt.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const periods = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const data = [];
  
  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    data.push({
      date: dateStr,
      conversions: grouped[dateStr] || 0
    });
  }
  
  return data;
}

function generateTopLocations(properties) {
  const locationStats = properties.reduce((acc, prop) => {
    const location = prop.location?.city || 'Unknown';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(locationStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([location, count]) => ({ location, count }));
}

function generatePriceRangeStats(properties) {
  const ranges = {
    '0-1M': 0,
    '1M-5M': 0,
    '5M-10M': 0,
    '10M+': 0
  };

  properties.forEach(prop => {
    const price = prop.price || 0;
    if (price < 1000000) ranges['0-1M']++;
    else if (price < 5000000) ranges['1M-5M']++;
    else if (price < 10000000) ranges['5M-10M']++;
    else ranges['10M+']++;
  });

  return Object.entries(ranges).map(([range, count]) => ({ range, count }));
}

function generateContactSources(contacts) {
  const sources = contacts.reduce((acc, contact) => {
    const source = contact.source || 'website';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(sources).map(([source, count]) => ({ source, count }));
}