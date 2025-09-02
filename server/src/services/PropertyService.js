const BaseService = require('./BaseService');
const PropertyRepository = require('../database/repositories/PropertyRepository');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, PROPERTY_TYPES, PROPERTY_STATUS } = require('../../constants');

/**
 * Property Service - Handles all property-related business logic
 */
class PropertyService extends BaseService {
  constructor() {
    super(new PropertyRepository());
  }

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @param {String} userId - User ID (property owner/agent)
   * @returns {Promise<Object>} Creation result
   */
  async createProperty(propertyData, userId) {
    try {
      this.log('createProperty', { userId, type: propertyData.type });

      // Validate property data
      const validation = this.validatePropertyData(propertyData);
      if (!validation.isValid) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validation.errors
        );
      }

      // Create property
      const property = await this.repository.create({
        ...propertyData,
        user: userId,
        status: PROPERTY_STATUS.AVAILABLE,
        views: 0
      });

      return this.createResponse(
        property,
        SUCCESS_MESSAGES.PROPERTY_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      this.log('createProperty', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get property by ID
   * @param {String} propertyId - Property ID
   * @param {Boolean} incrementViews - Whether to increment view count
   * @returns {Promise<Object>} Property data
   */
  async getProperty(propertyId, incrementViews = false) {
    try {
      const property = await this.repository.findById(propertyId);
      if (!property) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Increment views if requested
      if (incrementViews) {
        await this.repository.incrementViews(propertyId);
        property.views += 1;
      }

      return this.createResponse(property);
    } catch (error) {
      this.log('getProperty', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update property
   * @param {String} propertyId - Property ID
   * @param {Object} updateData - Update data
   * @param {String} userId - User ID (for authorization)
   * @returns {Promise<Object>} Update result
   */
  async updateProperty(propertyId, updateData, userId) {
    try {
      this.log('updateProperty', { propertyId, userId, fields: Object.keys(updateData) });

      // Check if property exists and user has permission
      const existingProperty = await this.repository.findById(propertyId);
      if (!existingProperty) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Check ownership (user can only update their own properties unless admin)
      if (existingProperty.user.toString() !== userId) {
        return this.createErrorResponse(
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      // Validate update data
      const validation = this.validatePropertyData(updateData, false);
      if (!validation.isValid) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validation.errors
        );
      }

      const property = await this.repository.updateById(propertyId, updateData);
      return this.createResponse(
        property,
        SUCCESS_MESSAGES.PROPERTY_UPDATED
      );
    } catch (error) {
      this.log('updateProperty', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete property
   * @param {String} propertyId - Property ID
   * @param {String} userId - User ID (for authorization)
   * @returns {Promise<Object>} Delete result
   */
  async deleteProperty(propertyId, userId) {
    try {
      this.log('deleteProperty', { propertyId, userId });

      // Check if property exists and user has permission
      const existingProperty = await this.repository.findById(propertyId);
      if (!existingProperty) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Check ownership
      if (existingProperty.user.toString() !== userId) {
        return this.createErrorResponse(
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      await this.repository.deleteById(propertyId);
      return this.createResponse(
        null,
        SUCCESS_MESSAGES.PROPERTY_DELETED
      );
    } catch (error) {
      this.log('deleteProperty', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Search properties with filters
   * @param {Object} filters - Search filters
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Search results
   */
  async searchProperties(filters = {}, pagination = {}) {
    try {
      this.log('searchProperties', { filters, pagination });

      const result = await this.repository.findWithPagination(
        this.buildSearchQuery(filters),
        pagination,
        { sort: { createdAt: -1 } }
      );

      return this.createResponse({
        properties: result.data,
        pagination: result.pagination,
        filters: filters
      });
    } catch (error) {
      this.log('searchProperties', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get featured properties
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Featured properties
   */
  async getFeaturedProperties(options = {}) {
    try {
      const properties = await this.repository.findFeatured({
        ...options,
        sort: { createdAt: -1 },
        limit: options.limit || 10
      });

      return this.createResponse(properties);
    } catch (error) {
      this.log('getFeaturedProperties', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get properties by user
   * @param {String} userId - User ID
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} User properties
   */
  async getUserProperties(userId, pagination = {}) {
    try {
      this.log('getUserProperties', { userId, pagination });

      const result = await this.repository.findWithPagination(
        { user: userId },
        pagination,
        { sort: { createdAt: -1 } }
      );

      return this.createResponse({
        properties: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      this.log('getUserProperties', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get similar properties
   * @param {String} propertyId - Property ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Similar properties
   */
  async getSimilarProperties(propertyId, options = {}) {
    try {
      const properties = await this.repository.findSimilarProperties(propertyId, options);
      return this.createResponse(properties);
    } catch (error) {
      this.log('getSimilarProperties', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get trending properties
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Trending properties
   */
  async getTrendingProperties(options = {}) {
    try {
      const properties = await this.repository.findTrendingProperties(options);
      return this.createResponse(properties);
    } catch (error) {
      this.log('getTrendingProperties', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get recent properties
   * @param {Number} days - Number of days
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Recent properties
   */
  async getRecentProperties(days = 7, options = {}) {
    try {
      const properties = await this.repository.findRecentProperties(days, options);
      return this.createResponse(properties);
    } catch (error) {
      this.log('getRecentProperties', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get property statistics
   * @returns {Promise<Object>} Property statistics
   */
  async getPropertyStats() {
    try {
      const stats = await this.repository.getPropertyStats();
      return this.createResponse(stats);
    } catch (error) {
      this.log('getPropertyStats', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get properties by type statistics
   * @returns {Promise<Object>} Properties by type
   */
  async getPropertiesByType() {
    try {
      const stats = await this.repository.getPropertiesByType();
      return this.createResponse(stats);
    } catch (error) {
      this.log('getPropertiesByType', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get properties by location statistics
   * @returns {Promise<Object>} Properties by location
   */
  async getPropertiesByLocation() {
    try {
      const stats = await this.repository.getPropertiesByLocation();
      return this.createResponse(stats);
    } catch (error) {
      this.log('getPropertiesByLocation', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update property status
   * @param {String} propertyId - Property ID
   * @param {String} status - New status
   * @param {String} userId - User ID (for authorization)
   * @returns {Promise<Object>} Update result
   */
  async updatePropertyStatus(propertyId, status, userId) {
    try {
      this.log('updatePropertyStatus', { propertyId, status, userId });

      // Validate status
      if (!Object.values(PROPERTY_STATUS).includes(status)) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          ['Invalid property status']
        );
      }

      // Check if property exists and user has permission
      const existingProperty = await this.repository.findById(propertyId);
      if (!existingProperty) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Check ownership
      if (existingProperty.user.toString() !== userId) {
        return this.createErrorResponse(
          ERROR_MESSAGES.FORBIDDEN,
          HTTP_STATUS.FORBIDDEN
        );
      }

      const property = await this.repository.updateById(propertyId, { status });
      return this.createResponse(
        property,
        'Property status updated successfully'
      );
    } catch (error) {
      this.log('updatePropertyStatus', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Toggle property featured status
   * @param {String} propertyId - Property ID
   * @param {Boolean} isFeatured - Featured status
   * @returns {Promise<Object>} Update result
   */
  async toggleFeatured(propertyId, isFeatured) {
    try {
      this.log('toggleFeatured', { propertyId, isFeatured });

      const property = await this.repository.updateById(propertyId, { isFeatured });
      if (!property) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      return this.createResponse(
        property,
        `Property ${isFeatured ? 'featured' : 'unfeatured'} successfully`
      );
    } catch (error) {
      this.log('toggleFeatured', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Validate property data
   * @param {Object} propertyData - Property data
   * @param {Boolean} isCreation - Whether this is for creation
   * @returns {Object} Validation result
   */
  validatePropertyData(propertyData, isCreation = true) {
    const rules = {
      title: {
        required: true,
        type: 'string',
        min: 5,
        max: 200
      },
      description: {
        required: true,
        type: 'string',
        min: 20,
        max: 2000
      },
      type: {
        required: true,
        type: 'string'
      },
      price: {
        required: true,
        type: 'number'
      },
      area: {
        required: true,
        type: 'number'
      },
      bedrooms: {
        required: false,
        type: 'number'
      },
      bathrooms: {
        required: false,
        type: 'number'
      },
      city: {
        required: true,
        type: 'string',
        min: 2,
        max: 50
      },
      state: {
        required: true,
        type: 'string',
        min: 2,
        max: 50
      },
      address: {
        required: true,
        type: 'string',
        min: 10,
        max: 200
      }
    };

    const validation = this.validate(propertyData, rules);

    // Additional validation for property type
    if (propertyData.type && !Object.values(PROPERTY_TYPES).includes(propertyData.type)) {
      validation.errors.push('Invalid property type');
      validation.isValid = false;
    }

    // Additional validation for price
    if (propertyData.price && propertyData.price <= 0) {
      validation.errors.push('Price must be greater than 0');
      validation.isValid = false;
    }

    // Additional validation for area
    if (propertyData.area && propertyData.area <= 0) {
      validation.errors.push('Area must be greater than 0');
      validation.isValid = false;
    }

    return validation;
  }

  /**
   * Build search query from filters
   * @param {Object} filters - Search filters
   * @returns {Object} MongoDB query
   */
  buildSearchQuery(filters) {
    return this.repository.buildSearchQuery(filters);
  }
}

module.exports = PropertyService;