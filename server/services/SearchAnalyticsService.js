const SearchAnalytics = require('../models/SearchAnalytics');
const Property = require('../models/Property');

/**
 * Search Analytics Service
 * Tracks search queries, results, and user behavior
 */
class SearchAnalyticsService {
  /**
   * Log a search query
   * @param {Object} searchData - Search data to log
   * @returns {Promise<Object>} Created analytics record
   */
  async logSearch(searchData) {
    try {
      const {
        query,
        userId = null,
        sessionId,
        resultsCount = 0,
        filters = {},
        userAgent = '',
        ipAddress = ''
      } = searchData;

      const analytics = await SearchAnalytics.create({
        query: query || '',
        userId,
        sessionId: sessionId || this.generateSessionId(),
        resultsCount,
        filters,
        userAgent,
        ipAddress,
        timestamp: new Date()
      });

      return analytics;
    } catch (error) {
      console.error('Error logging search:', error);
      return null;
    }
  }

  /**
   * Track when a user clicks on a search result
   * @param {String} searchId - Search analytics ID
   * @param {String} propertyId - Property ID that was clicked
   * @param {Number} position - Position of the result (1-based)
   */
  async trackResultClick(searchId, propertyId, position) {
    try {
      await SearchAnalytics.findByIdAndUpdate(searchId, {
        $push: {
          clickedResults: {
            propertyId,
            position,
            clickedAt: new Date()
          }
        }
      });
    } catch (error) {
      console.error('Error tracking result click:', error);
    }
  }

  /**
   * Track search conversion (view, inquiry, favorite, etc.)
   * @param {String} searchId - Search analytics ID
   * @param {String} conversionType - Type of conversion
   */
  async trackConversion(searchId, conversionType) {
    try {
      await SearchAnalytics.findByIdAndUpdate(searchId, {
        conversion: true,
        conversionType
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  /**
   * Get popular searches
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Popular searches with counts
   */
  async getPopularSearches(options = {}) {
    const {
      limit = 10,
      days = 30,
      minResults = 0
    } = options;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const popularSearches = await SearchAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            resultsCount: { $gte: minResults },
            query: { $ne: '', $exists: true }
          }
        },
        {
          $group: {
            _id: '$query',
            count: { $sum: 1 },
            avgResultsCount: { $avg: '$resultsCount' },
            conversionRate: {
              $avg: {
                $cond: ['$conversion', 1, 0]
              }
            }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            query: '$_id',
            count: 1,
            avgResultsCount: { $round: ['$avgResultsCount', 0] },
            conversionRate: { $round: ['$conversionRate', 2] },
            _id: 0
          }
        }
      ]);

      return popularSearches;
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  }

  /**
   * Get trending searches (recent popular searches)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Trending searches
   */
  async getTrendingSearches(options = {}) {
    const {
      limit = 10,
      hours = 24
    } = options;

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    try {
      const trendingSearches = await SearchAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            query: { $ne: '', $exists: true }
          }
        },
        {
          $group: {
            _id: '$query',
            count: { $sum: 1 },
            recentTimestamp: { $max: '$timestamp' }
          }
        },
        {
          $sort: { count: -1, recentTimestamp: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            query: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]);

      return trendingSearches;
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  }

  /**
   * Get zero-result searches (searches with no results)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Zero-result searches
   */
  async getZeroResultSearches(options = {}) {
    const {
      limit = 20,
      days = 30
    } = options;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const zeroResultSearches = await SearchAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            resultsCount: 0,
            query: { $ne: '', $exists: true }
          }
        },
        {
          $group: {
            _id: '$query',
            count: { $sum: 1 },
            lastSearched: { $max: '$timestamp' }
          }
        },
        {
          $sort: { count: -1, lastSearched: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            query: '$_id',
            count: 1,
            lastSearched: 1,
            _id: 0
          }
        }
      ]);

      return zeroResultSearches;
    } catch (error) {
      console.error('Error getting zero-result searches:', error);
      return [];
    }
  }

  /**
   * Get search-to-conversion metrics
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Conversion metrics
   */
  async getConversionMetrics(options = {}) {
    const { days = 30 } = options;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const metrics = await SearchAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: null,
            totalSearches: { $sum: 1 },
            totalConversions: {
              $sum: {
                $cond: ['$conversion', 1, 0]
              }
            },
            totalClicks: {
              $sum: { $size: '$clickedResults' }
            },
            avgResultsPerSearch: { $avg: '$resultsCount' }
          }
        },
        {
          $project: {
            _id: 0,
            totalSearches: 1,
            totalConversions: 1,
            totalClicks: 1,
            conversionRate: {
              $cond: [
                { $gt: ['$totalSearches', 0] },
                {
                  $multiply: [
                    { $divide: ['$totalConversions', '$totalSearches'] },
                    100
                  ]
                },
                0
              ]
            },
            clickThroughRate: {
              $cond: [
                { $gt: ['$totalSearches', 0] },
                {
                  $multiply: [
                    { $divide: ['$totalClicks', '$totalSearches'] },
                    100
                  ]
                },
                0
              ]
            },
            avgResultsPerSearch: { $round: ['$avgResultsPerSearch', 2] }
          }
        }
      ]);

      return metrics[0] || {
        totalSearches: 0,
        totalConversions: 0,
        totalClicks: 0,
        conversionRate: 0,
        clickThroughRate: 0,
        avgResultsPerSearch: 0
      };
    } catch (error) {
      console.error('Error getting conversion metrics:', error);
      return {
        totalSearches: 0,
        totalConversions: 0,
        totalClicks: 0,
        conversionRate: 0,
        clickThroughRate: 0,
        avgResultsPerSearch: 0
      };
    }
  }

  /**
   * Generate a session ID
   * @returns {String} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new SearchAnalyticsService();

