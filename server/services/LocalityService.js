const Property = require('../models/Property');

class LocalityService {
  /**
   * Get locality statistics and analytics
   */
  async getLocalityStats(city, locality) {
    try {
      const matchQuery = {
        'address.city': new RegExp(city, 'i'),
        'address.locality': new RegExp(locality, 'i'),
        status: { $in: ['For Sale', 'For Rent'] }
      };

      // Get all properties in locality
      const properties = await Property.find(matchQuery).lean();

      if (properties.length === 0) {
        return {
          city,
          locality,
          totalProperties: 0,
          message: 'No properties found in this locality'
        };
      }

      // Calculate statistics
      const stats = {
        city,
        locality,
        totalProperties: properties.length,
        averagePrice: this.calculateAverage(properties.map(p => p.price)),
        medianPrice: this.calculateMedian(properties.map(p => p.price)),
        minPrice: Math.min(...properties.map(p => p.price)),
        maxPrice: Math.max(...properties.map(p => p.price)),
        averagePricePerSqft: this.calculateAverage(
          properties
            .filter(p => p.area > 0)
            .map(p => p.price / p.area)
        ),
        averageArea: this.calculateAverage(properties.map(p => p.area)),
        propertyTypeDistribution: this.getPropertyTypeDistribution(properties),
        statusDistribution: this.getStatusDistribution(properties),
        priceTrends: await this.getPriceTrends(matchQuery),
        supplyVsDemand: await this.getSupplyVsDemand(matchQuery, properties),
        averageDaysOnMarket: await this.getAverageDaysOnMarket(matchQuery)
      };

      return stats;
    } catch (error) {
      console.error('Error getting locality stats:', error);
      throw error;
    }
  }

  /**
   * Get price trends over time
   */
  async getPriceTrends(matchQuery) {
    try {
      const trends = await Property.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            averagePrice: { $avg: '$price' },
            averagePricePerSqft: {
              $avg: {
                $cond: [
                  { $gt: ['$area', 0] },
                  { $divide: ['$price', '$area'] },
                  null
                ]
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 } // Last 12 months
      ]);

      return trends.map(t => ({
        period: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
        averagePrice: Math.round(t.averagePrice),
        averagePricePerSqft: Math.round(t.averagePricePerSqft || 0),
        propertyCount: t.count
      }));
    } catch (error) {
      console.error('Error getting price trends:', error);
      return [];
    }
  }

  /**
   * Calculate supply vs demand ratio
   */
  async getSupplyVsDemand(matchQuery, properties) {
    try {
      const totalListings = properties.length;
      const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalFavorites = await Property.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'favorites',
            as: 'favoritedBy'
          }
        },
        {
          $project: {
            favoriteCount: { $size: '$favoritedBy' }
          }
        },
        {
          $group: {
            _id: null,
            totalFavorites: { $sum: '$favoriteCount' }
          }
        }
      ]);

      const favorites = totalFavorites[0]?.totalFavorites || 0;
      const demandScore = (totalViews + favorites * 3) / totalListings || 0;

      return {
        totalListings,
        totalViews,
        totalFavorites: favorites,
        demandScore: Math.round(demandScore * 100) / 100,
        ratio: totalListings > 0 ? (totalViews / totalListings).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error calculating supply vs demand:', error);
      return {
        totalListings: properties.length,
        totalViews: 0,
        totalFavorites: 0,
        demandScore: 0,
        ratio: 0
      };
    }
  }

  /**
   * Get average days on market
   */
  async getAverageDaysOnMarket(matchQuery) {
    try {
      const result = await Property.aggregate([
        { $match: matchQuery },
        {
          $project: {
            daysOnMarket: {
              $divide: [
                { $subtract: [new Date(), '$createdAt'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            averageDays: { $avg: '$daysOnMarket' }
          }
        }
      ]);

      return result[0]?.averageDays ? Math.round(result[0].averageDays) : 0;
    } catch (error) {
      console.error('Error calculating average days on market:', error);
      return 0;
    }
  }

  /**
   * Get property type distribution
   */
  getPropertyTypeDistribution(properties) {
    const distribution = {};
    properties.forEach(property => {
      const type = property.type || 'Unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Get status distribution
   */
  getStatusDistribution(properties) {
    const distribution = {};
    properties.forEach(property => {
      const status = property.status || 'Unknown';
      distribution[status] = (distribution[status] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Calculate average
   */
  calculateAverage(arr) {
    if (arr.length === 0) return 0;
    const valid = arr.filter(v => v != null && !isNaN(v));
    if (valid.length === 0) return 0;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  }

  /**
   * Calculate median
   */
  calculateMedian(arr) {
    if (arr.length === 0) return 0;
    const sorted = arr.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
    if (sorted.length === 0) return 0;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
}

module.exports = new LocalityService();

