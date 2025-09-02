// Analytics service for collecting and processing application metrics

const { v4: uuidv4 } = require('uuid');

class AnalyticsService {
  constructor() {
    this.metrics = {
      requests: new Map(),
      users: new Map(),
      properties: new Map(),
      searches: new Map(),
      errors: new Map()
    };
    
    this.startTime = Date.now();
  }

  // Track user session
  trackUserSession(userId, sessionData) {
    const sessionId = uuidv4();
    const session = {
      sessionId,
      userId,
      startTime: new Date().toISOString(),
      ...sessionData
    };
    
    this.metrics.users.set(userId, {
      ...this.metrics.users.get(userId),
      currentSession: session,
      lastActive: new Date().toISOString()
    });
    
    return sessionId;
  }

  // Track page views
  trackPageView(userId, pageData) {
    const view = {
      id: uuidv4(),
      userId,
      page: pageData.page,
      timestamp: new Date().toISOString(),
      duration: pageData.duration || 0,
      referrer: pageData.referrer
    };
    
    const userMetrics = this.metrics.users.get(userId) || { views: [] };
    userMetrics.views = userMetrics.views || [];
    userMetrics.views.push(view);
    
    this.metrics.users.set(userId, userMetrics);
    
    return view.id;
  }

  // Track property interactions
  trackPropertyInteraction(userId, propertyId, interactionType, data = {}) {
    const interaction = {
      id: uuidv4(),
      userId,
      propertyId,
      type: interactionType, // view, favorite, contact, share
      timestamp: new Date().toISOString(),
      ...data
    };
    
    const propertyMetrics = this.metrics.properties.get(propertyId) || { interactions: [] };
    propertyMetrics.interactions = propertyMetrics.interactions || [];
    propertyMetrics.interactions.push(interaction);
    
    this.metrics.properties.set(propertyId, propertyMetrics);
    
    return interaction.id;
  }

  // Track search queries
  trackSearchQuery(userId, searchData) {
    const query = {
      id: uuidv4(),
      userId,
      query: searchData.query,
      filters: searchData.filters,
      results: searchData.results,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.searches.set(query.id, query);
    
    return query.id;
  }

  // Track conversion events
  trackConversion(userId, conversionData) {
    const conversion = {
      id: uuidv4(),
      userId,
      type: conversionData.type, // registration, subscription, contact
      value: conversionData.value,
      timestamp: new Date().toISOString(),
      metadata: conversionData.metadata
    };
    
    const userMetrics = this.metrics.users.get(userId) || { conversions: [] };
    userMetrics.conversions = userMetrics.conversions || [];
    userMetrics.conversions.push(conversion);
    
    this.metrics.users.set(userId, userMetrics);
    
    return conversion.id;
  }

  // Track error events
  trackError(errorData) {
    const error = {
      id: uuidv4(),
      message: errorData.message,
      stack: errorData.stack,
      userId: errorData.userId,
      url: errorData.url,
      timestamp: new Date().toISOString(),
      severity: errorData.severity || 'error'
    };
    
    this.metrics.errors.set(error.id, error);
    
    return error.id;
  }

  // Get user analytics
  getUserAnalytics(userId) {
    const userMetrics = this.metrics.users.get(userId);
    if (!userMetrics) return null;
    
    return {
      userId,
      totalViews: userMetrics.views?.length || 0,
      totalConversions: userMetrics.conversions?.length || 0,
      lastActive: userMetrics.lastActive,
      currentSession: userMetrics.currentSession,
      topPages: this.getTopPages(userMetrics.views),
      conversionRate: this.calculateConversionRate(userMetrics)
    };
  }

  // Get property analytics
  getPropertyAnalytics(propertyId) {
    const propertyMetrics = this.metrics.properties.get(propertyId);
    if (!propertyMetrics) return null;
    
    const interactions = propertyMetrics.interactions || [];
    
    return {
      propertyId,
      totalViews: interactions.filter(i => i.type === 'view').length,
      totalFavorites: interactions.filter(i => i.type === 'favorite').length,
      totalContacts: interactions.filter(i => i.type === 'contact').length,
      totalShares: interactions.filter(i => i.type === 'share').length,
      uniqueUsers: new Set(interactions.map(i => i.userId)).size,
      lastInteraction: interactions[interactions.length - 1]?.timestamp
    };
  }

  // Get search analytics
  getSearchAnalytics(timeframe = '24h') {
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.getTimeframeMs(timeframe));
    
    const recentSearches = Array.from(this.metrics.searches.values())
      .filter(search => new Date(search.timestamp) > cutoff);
    
    return {
      totalSearches: recentSearches.length,
      uniqueUsers: new Set(recentSearches.map(s => s.userId)).size,
      topQueries: this.getTopQueries(recentSearches),
      averageResults: this.getAverageResults(recentSearches),
      noResultsRate: this.getNoResultsRate(recentSearches)
    };
  }

  // Get system metrics
  getSystemMetrics() {
    const uptime = Date.now() - this.startTime;
    const memUsage = process.memoryUsage();
    
    return {
      uptime: Math.floor(uptime / 1000), // seconds
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      },
      requests: {
        total: Array.from(this.metrics.requests.values()).length,
        errors: Array.from(this.metrics.errors.values()).length
      },
      users: {
        active: this.metrics.users.size,
        new: this.getNewUsersCount('24h')
      }
    };
  }

  // Get dashboard analytics
  getDashboardAnalytics() {
    return {
      overview: {
        totalUsers: this.metrics.users.size,
        totalProperties: this.metrics.properties.size,
        totalSearches: this.metrics.searches.size,
        totalErrors: this.metrics.errors.size
      },
      recent: {
        searches: this.getRecentSearches(10),
        errors: this.getRecentErrors(10),
        users: this.getRecentUsers(10)
      },
      trends: {
        userGrowth: this.getUserGrowthTrend('7d'),
        searchTrend: this.getSearchTrend('7d'),
        errorTrend: this.getErrorTrend('7d')
      }
    };
  }

  // Helper methods
  getTopPages(views) {
    if (!views) return [];
    
    const pageCounts = {};
    views.forEach(view => {
      pageCounts[view.page] = (pageCounts[view.page] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));
  }

  calculateConversionRate(userMetrics) {
    const views = userMetrics.views?.length || 0;
    const conversions = userMetrics.conversions?.length || 0;
    return views > 0 ? (conversions / views * 100).toFixed(2) : 0;
  }

  getTopQueries(searches) {
    const queryCounts = {};
    searches.forEach(search => {
      const query = search.query || 'empty';
      queryCounts[query] = (queryCounts[query] || 0) + 1;
    });
    
    return Object.entries(queryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }

  getAverageResults(searches) {
    if (searches.length === 0) return 0;
    const total = searches.reduce((sum, search) => sum + (search.results || 0), 0);
    return Math.round(total / searches.length);
  }

  getNoResultsRate(searches) {
    if (searches.length === 0) return 0;
    const noResults = searches.filter(search => (search.results || 0) === 0).length;
    return ((noResults / searches.length) * 100).toFixed(2);
  }

  getTimeframeMs(timeframe) {
    const timeframes = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return timeframes[timeframe] || timeframes['24h'];
  }

  getRecentSearches(limit) {
    return Array.from(this.metrics.searches.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getRecentErrors(limit) {
    return Array.from(this.metrics.errors.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getRecentUsers(limit) {
    return Array.from(this.metrics.users.entries())
      .sort(([,a], [,b]) => new Date(b.lastActive) - new Date(a.lastActive))
      .slice(0, limit)
      .map(([userId, data]) => ({ userId, ...data }));
  }

  getUserGrowthTrend(timeframe) {
    // Simplified implementation - in production, this would query a database
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.getTimeframeMs(timeframe));
    
    const recentUsers = Array.from(this.metrics.users.values())
      .filter(user => new Date(user.lastActive) > cutoff);
    
    return {
      period: timeframe,
      count: recentUsers.length,
      growth: '+12%' // Placeholder - would calculate actual growth
    };
  }

  getSearchTrend(timeframe) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.getTimeframeMs(timeframe));
    
    const recentSearches = Array.from(this.metrics.searches.values())
      .filter(search => new Date(search.timestamp) > cutoff);
    
    return {
      period: timeframe,
      count: recentSearches.length,
      trend: '+8%' // Placeholder
    };
  }

  getErrorTrend(timeframe) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.getTimeframeMs(timeframe));
    
    const recentErrors = Array.from(this.metrics.errors.values())
      .filter(error => new Date(error.timestamp) > cutoff);
    
    return {
      period: timeframe,
      count: recentErrors.length,
      trend: '-5%' // Placeholder
    };
  }

  getNewUsersCount(timeframe) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - this.getTimeframeMs(timeframe));
    
    return Array.from(this.metrics.users.values())
      .filter(user => new Date(user.lastActive) > cutoff).length;
  }

  // Export analytics data
  exportAnalytics(format = 'json') {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: {
        users: Object.fromEntries(this.metrics.users),
        properties: Object.fromEntries(this.metrics.properties),
        searches: Object.fromEntries(this.metrics.searches),
        errors: Object.fromEntries(this.metrics.errors)
      },
      system: this.getSystemMetrics()
    };
    
    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    
    return data;
  }

  convertToCSV(data) {
    // Simplified CSV conversion - in production, use a proper CSV library
    const csv = [];
    csv.push('Type,ID,Timestamp,Data');
    
    Object.entries(data.metrics).forEach(([type, items]) => {
      Object.entries(items).forEach(([id, item]) => {
        csv.push(`${type},${id},${item.timestamp || new Date().toISOString()},${JSON.stringify(item)}`);
      });
    });
    
    return csv.join('\n');
  }
}

module.exports = new AnalyticsService();