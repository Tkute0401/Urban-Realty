const BaseRepository = require('./BaseRepository');
const Property = require('../../models/Property');
const { PROPERTY_TYPES, PROPERTY_STATUS } = require('../../constants');

/**
 * Property Repository - Handles all property-related database operations
 */
class PropertyRepository extends BaseRepository {
  constructor() {
    super(Property);
  }

  /**
   * Find properties by type
   * @param {String} type - Property type
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Properties of specified type
   */
  async findByType(type, options = {}) {
    return await this.find({ type }, options);
  }

  /**
   * Find properties by status
   * @param {String} status - Property status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Properties with specified status
   */
  async findByStatus(status, options = {}) {
    return await this.find({ status }, options);
  }

  /**
   * Find properties by location
   * @param {String} location - Property location
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Properties in specified location
   */
  async findByLocation(location, options = {}) {
    return await this.find({ 
      $or: [
        { city: { $regex: location, $options: 'i' } },
        { state: { $regex: location, $options: 'i' } },
        { address: { $regex: location, $options: 'i' } }
      ]
    }, options);
  }

  /**
   * Find properties by price range
   * @param {Number} minPrice - Minimum price
   * @param {Number} maxPrice - Maximum price
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Properties in price range
   */
  async findByPriceRange(minPrice, maxPrice, options = {}) {
    return await this.find({
      price: {
        $gte: minPrice,
        $lte: maxPrice
      }
    }, options);
  }

  /**
   * Find featured properties
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Featured properties
   */
  async findFeatured(options = {}) {
    return await this.find({ isFeatured: true }, options);
  }

  /**
   * Find properties by user/agent
   * @param {String} userId - User/Agent ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Properties by user
   */
  async findByUser(userId, options = {}) {
    return await this.find({ user: userId }, options);
  }

  /**
   * Search properties with advanced filters
   * @param {Object} filters - Search filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Filtered properties
   */
  async searchProperties(filters = {}, options = {}) {
    const query = this.buildSearchQuery(filters);
    return await this.find(query, options);
  }

  /**
   * Build search query from filters
   * @param {Object} filters - Search filters
   * @returns {Object} MongoDB query
   */
  buildSearchQuery(filters) {
    const query = {};

    // Basic filters
    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.city) {
      query.city = { $regex: filters.city, $options: 'i' };
    }

    if (filters.state) {
      query.state = { $regex: filters.state, $options: 'i' };
    }

    // Price range
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    // Area range
    if (filters.minArea || filters.maxArea) {
      query.area = {};
      if (filters.minArea) query.area.$gte = filters.minArea;
      if (filters.maxArea) query.area.$lte = filters.maxArea;
    }

    // Bedrooms
    if (filters.bedrooms) {
      query.bedrooms = { $gte: filters.bedrooms };
    }

    // Bathrooms
    if (filters.bathrooms) {
      query.bathrooms = { $gte: filters.bathrooms };
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $in: filters.amenities };
    }

    // Featured properties
    if (filters.featured !== undefined) {
      query.isFeatured = filters.featured;
    }

    // Text search
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { address: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return query;
  }

  /**
   * Get property statistics
   * @returns {Promise<Object>} Property statistics
   */
  async getPropertyStats() {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ['$status', PROPERTY_STATUS.AVAILABLE] }, 1, 0] } },
          sold: { $sum: { $cond: [{ $eq: ['$status', PROPERTY_STATUS.SOLD] }, 1, 0] } },
          rented: { $sum: { $cond: [{ $eq: ['$status', PROPERTY_STATUS.RENTED] }, 1, 0] } },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          avgPrice: { $avg: '$price' },
          totalValue: { $sum: '$price' }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      total: 0,
      available: 0,
      sold: 0,
      rented: 0,
      featured: 0,
      avgPrice: 0,
      totalValue: 0
    };
  }

  /**
   * Get properties by type statistics
   * @returns {Promise<Array>} Properties grouped by type
   */
  async getPropertiesByType() {
    const pipeline = [
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalValue: { $sum: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ];

    return await this.aggregate(pipeline);
  }

  /**
   * Get properties by location statistics
   * @returns {Promise<Array>} Properties grouped by location
   */
  async getPropertiesByLocation() {
    const pipeline = [
      {
        $group: {
          _id: { city: '$city', state: '$state' },
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ];

    return await this.aggregate(pipeline);
  }

  /**
   * Find similar properties
   * @param {String} propertyId - Property ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Similar properties
   */
  async findSimilarProperties(propertyId, options = {}) {
    const property = await this.findById(propertyId);
    if (!property) return [];

    const query = {
      _id: { $ne: propertyId },
      type: property.type,
      city: property.city,
      status: PROPERTY_STATUS.AVAILABLE
    };

    return await this.find(query, { ...options, limit: 6 });
  }

  /**
   * Update property views
   * @param {String} propertyId - Property ID
   * @returns {Promise<Object|null>} Updated property
   */
  async incrementViews(propertyId) {
    return await this.updateById(propertyId, {
      $inc: { views: 1 }
    });
  }

  /**
   * Find trending properties (most viewed in last 30 days)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Trending properties
   */
  async findTrendingProperties(options = {}) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return await this.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: PROPERTY_STATUS.AVAILABLE
    }, {
      ...options,
      sort: { views: -1 }
    });
  }

  /**
   * Find recently added properties
   * @param {Number} days - Number of days
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Recent properties
   */
  async findRecentProperties(days = 7, options = {}) {
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return await this.find({
      createdAt: { $gte: dateThreshold }
    }, {
      ...options,
      sort: { createdAt: -1 }
    });
  }

  /**
   * Get property analytics for user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Property analytics
   */
  async getUserPropertyAnalytics(userId) {
    const pipeline = [
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ['$status', PROPERTY_STATUS.AVAILABLE] }, 1, 0] } },
          sold: { $sum: { $cond: [{ $eq: ['$status', PROPERTY_STATUS.SOLD] }, 1, 0] } },
          rented: { $sum: { $cond: [{ $eq: ['$status', PROPERTY_STATUS.RENTED] }, 1, 0] } },
          totalViews: { $sum: '$views' },
          avgPrice: { $avg: '$price' },
          totalValue: { $sum: '$price' }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      total: 0,
      available: 0,
      sold: 0,
      rented: 0,
      totalViews: 0,
      avgPrice: 0,
      totalValue: 0
    };
  }

  /**
   * Bulk update property status
   * @param {Array} propertyIds - Array of property IDs
   * @param {String} status - New status
   * @returns {Promise<Object>} Update result
   */
  async bulkUpdateStatus(propertyIds, status) {
    return await this.updateMany(
      { _id: { $in: propertyIds } },
      { status }
    );
  }

  /**
   * Find properties with low views (for promotion suggestions)
   * @param {Number} threshold - View threshold
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Properties with low views
   */
  async findLowViewProperties(threshold = 10, options = {}) {
    return await this.find({
      views: { $lt: threshold },
      status: PROPERTY_STATUS.AVAILABLE
    }, options);
  }
}

module.exports = PropertyRepository;