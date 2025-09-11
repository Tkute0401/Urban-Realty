const { HTTP_STATUS, ERROR_MESSAGES } = require('../../constants');

/**
 * Base Service Class with common service operations
 * All services should extend this class for consistent behavior
 */
class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @returns {Promise<Object>} Created entity
   */
  async create(data) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw this.handleError(error, 'create');
    }
  }

  /**
   * Find entity by ID
   * @param {String} id - Entity ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found entity
   */
  async findById(id, options = {}) {
    try {
      const entity = await this.repository.findById(id, options);
      if (!entity) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      return entity;
    } catch (error) {
      throw this.handleError(error, 'findById');
    }
  }

  /**
   * Find one entity by query
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found entity
   */
  async findOne(query, options = {}) {
    try {
      return await this.repository.findOne(query, options);
    } catch (error) {
      throw this.handleError(error, 'findOne');
    }
  }

  /**
   * Find multiple entities
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Found entities
   */
  async find(query = {}, options = {}) {
    try {
      return await this.repository.find(query, options);
    } catch (error) {
      throw this.handleError(error, 'find');
    }
  }

  /**
   * Find entities with pagination
   * @param {Object} query - Query object
   * @param {Object} pagination - Pagination options
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Paginated results
   */
  async findWithPagination(query = {}, pagination = {}, options = {}) {
    try {
      return await this.repository.findWithPagination(query, pagination, options);
    } catch (error) {
      throw this.handleError(error, 'findWithPagination');
    }
  }

  /**
   * Update entity by ID
   * @param {String} id - Entity ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated entity
   */
  async updateById(id, data, options = {}) {
    try {
      const entity = await this.repository.updateById(id, data, options);
      if (!entity) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      return entity;
    } catch (error) {
      throw this.handleError(error, 'updateById');
    }
  }

  /**
   * Update one entity by query
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated entity
   */
  async updateOne(query, data, options = {}) {
    try {
      return await this.repository.updateOne(query, data, options);
    } catch (error) {
      throw this.handleError(error, 'updateOne');
    }
  }

  /**
   * Update multiple entities
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Update result
   */
  async updateMany(query, data, options = {}) {
    try {
      return await this.repository.updateMany(query, data, options);
    } catch (error) {
      throw this.handleError(error, 'updateMany');
    }
  }

  /**
   * Delete entity by ID
   * @param {String} id - Entity ID
   * @param {Object} options - Delete options
   * @returns {Promise<Object|null>} Deleted entity
   */
  async deleteById(id, options = {}) {
    try {
      const entity = await this.repository.deleteById(id, options);
      if (!entity) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      return entity;
    } catch (error) {
      throw this.handleError(error, 'deleteById');
    }
  }

  /**
   * Delete one entity by query
   * @param {Object} query - Query object
   * @param {Object} options - Delete options
   * @returns {Promise<Object|null>} Deleted entity
   */
  async deleteOne(query, options = {}) {
    try {
      return await this.repository.deleteOne(query, options);
    } catch (error) {
      throw this.handleError(error, 'deleteOne');
    }
  }

  /**
   * Delete multiple entities
   * @param {Object} query - Query object
   * @param {Object} options - Delete options
   * @returns {Promise<Object>} Delete result
   */
  async deleteMany(query, options = {}) {
    try {
      return await this.repository.deleteMany(query, options);
    } catch (error) {
      throw this.handleError(error, 'deleteMany');
    }
  }

  /**
   * Count entities
   * @param {Object} query - Query object
   * @returns {Promise<Number>} Entity count
   */
  async count(query = {}) {
    try {
      return await this.repository.count(query);
    } catch (error) {
      throw this.handleError(error, 'count');
    }
  }

  /**
   * Check if entity exists
   * @param {Object} query - Query object
   * @returns {Promise<Boolean>} Existence status
   */
  async exists(query) {
    try {
      return await this.repository.exists(query);
    } catch (error) {
      throw this.handleError(error, 'exists');
    }
  }

  /**
   * Get service statistics
   * @returns {Promise<Object>} Service statistics
   */
  async getStats() {
    try {
      return await this.repository.getStats();
    } catch (error) {
      throw this.handleError(error, 'getStats');
    }
  }

  /**
   * Validate entity data
   * @param {Object} data - Entity data
   * @param {Object} rules - Validation rules
   * @returns {Object} Validation result
   */
  validate(data, rules = {}) {
    const errors = [];

    // Basic validation - can be extended by subclasses
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = data[field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
      }

      if (value !== undefined && value !== null) {
        if (rule.type && typeof value !== rule.type) {
          errors.push(`${field} must be of type ${rule.type}`);
        }

        if (rule.min && value.length < rule.min) {
          errors.push(`${field} must be at least ${rule.min} characters`);
        }

        if (rule.max && value.length > rule.max) {
          errors.push(`${field} must be no more than ${rule.max} characters`);
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Handle service errors
   * @param {Error} error - Error object
   * @param {String} operation - Operation name
   * @returns {Error} Formatted error
   */
  handleError(error, operation) {
    console.error(`Service Error in ${this.constructor.name}.${operation}:`, error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return new Error(ERROR_MESSAGES.VALIDATION_ERROR);
    }

    if (error.code === 11000) {
      return new Error(ERROR_MESSAGES.DUPLICATE_ENTRY);
    }

    if (error.message === ERROR_MESSAGES.NOT_FOUND) {
      return error;
    }

    // Return generic error for unknown cases
    return new Error(ERROR_MESSAGES.INTERNAL_ERROR);
  }

  /**
   * Create standardized API response
   * @param {Object} data - Response data
   * @param {String} message - Response message
   * @param {Number} statusCode - HTTP status code
   * @returns {Object} Standardized response
   */
  createResponse(data = null, message = '', statusCode = HTTP_STATUS.OK) {
    return {
      success: statusCode < 400,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create error response
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {Object} details - Error details
   * @returns {Object} Error response
   */
  createErrorResponse(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    return {
      success: false,
      statusCode,
      message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log service operation
   * @param {String} operation - Operation name
   * @param {Object} data - Operation data
   * @param {String} level - Log level
   */
  log(operation, data = {}, level = 'info') {
    const logData = {
      service: this.constructor.name,
      operation,
      data,
      timestamp: new Date().toISOString()
    };

    switch (level) {
      case 'error':
        console.error('Service Log:', logData);
        break;
      case 'warn':
        console.warn('Service Log:', logData);
        break;
      case 'debug':
        console.debug('Service Log:', logData);
        break;
      default:
        console.log('Service Log:', logData);
    }
  }
}

module.exports = BaseService;