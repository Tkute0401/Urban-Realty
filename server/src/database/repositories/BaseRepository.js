const BaseModel = require('../models/BaseModel');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../../../constants');

/**
 * Base Repository Class implementing Repository Pattern
 * Provides data access layer abstraction
 */
class BaseRepository {
  constructor(model) {
    this.baseModel = new BaseModel(model);
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    return await this.baseModel.create(data);
  }

  /**
   * Find document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found document
   */
  async findById(id, options = {}) {
    return await this.baseModel.findById(id, options);
  }

  /**
   * Find one document by query
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found document
   */
  async findOne(query, options = {}) {
    return await this.baseModel.findOne(query, options);
  }

  /**
   * Find multiple documents
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Found documents
   */
  async find(query = {}, options = {}) {
    return await this.baseModel.find(query, options);
  }

  /**
   * Find documents with pagination
   * @param {Object} query - Query object
   * @param {Object} pagination - Pagination options
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Paginated results
   */
  async findWithPagination(query = {}, pagination = {}, options = {}) {
    return await this.baseModel.findWithPagination(query, pagination, options);
  }

  /**
   * Update document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated document
   */
  async updateById(id, data, options = {}) {
    return await this.baseModel.updateById(id, data, options);
  }

  /**
   * Update one document by query
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated document
   */
  async updateOne(query, data, options = {}) {
    return await this.baseModel.updateOne(query, data, options);
  }

  /**
   * Update multiple documents
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Update result
   */
  async updateMany(query, data, options = {}) {
    return await this.baseModel.updateMany(query, data, options);
  }

  /**
   * Delete document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Delete options
   * @returns {Promise<Object|null>} Deleted document
   */
  async deleteById(id, options = {}) {
    return await this.baseModel.deleteById(id, options);
  }

  /**
   * Delete one document by query
   * @param {Object} query - Query object
   * @param {Object} options - Delete options
   * @returns {Promise<Object|null>} Deleted document
   */
  async deleteOne(query, options = {}) {
    return await this.baseModel.deleteOne(query, options);
  }

  /**
   * Delete multiple documents
   * @param {Object} query - Query object
   * @param {Object} options - Delete options
   * @returns {Promise<Object>} Delete result
   */
  async deleteMany(query, options = {}) {
    return await this.baseModel.deleteMany(query, options);
  }

  /**
   * Count documents
   * @param {Object} query - Query object
   * @returns {Promise<Number>} Document count
   */
  async count(query = {}) {
    return await this.baseModel.count(query);
  }

  /**
   * Check if document exists
   * @param {Object} query - Query object
   * @returns {Promise<Boolean>} Existence status
   */
  async exists(query) {
    return await this.baseModel.exists(query);
  }

  /**
   * Aggregate documents
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Aggregated results
   */
  async aggregate(pipeline) {
    return await this.baseModel.aggregate(pipeline);
  }

  /**
   * Get model statistics
   * @returns {Promise<Object>} Model statistics
   */
  async getStats() {
    return await this.baseModel.getStats();
  }

  /**
   * Search documents with text search
   * @param {String} searchTerm - Search term
   * @param {Array} fields - Fields to search in
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Search results
   */
  async search(searchTerm, fields = [], options = {}) {
    if (!searchTerm || !fields.length) {
      return await this.find({}, options);
    }

    const searchQuery = {
      $or: fields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' }
      }))
    };

    return await this.find(searchQuery, options);
  }

  /**
   * Find documents with advanced filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Filtered results
   */
  async findWithFilters(filters = {}, options = {}) {
    const query = this.buildFilterQuery(filters);
    return await this.find(query, options);
  }

  /**
   * Build filter query from filter object
   * @param {Object} filters - Filter criteria
   * @returns {Object} MongoDB query
   */
  buildFilterQuery(filters) {
    const query = {};

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      
      if (value === null || value === undefined) {
        return;
      }

      // Handle different filter types
      if (typeof value === 'object' && value.operator) {
        switch (value.operator) {
          case 'gt':
            query[key] = { $gt: value.value };
            break;
          case 'gte':
            query[key] = { $gte: value.value };
            break;
          case 'lt':
            query[key] = { $lt: value.value };
            break;
          case 'lte':
            query[key] = { $lte: value.value };
            break;
          case 'in':
            query[key] = { $in: value.value };
            break;
          case 'nin':
            query[key] = { $nin: value.value };
            break;
          case 'regex':
            query[key] = { $regex: value.value, $options: 'i' };
            break;
          default:
            query[key] = value.value;
        }
      } else {
        query[key] = value;
      }
    });

    return query;
  }

  /**
   * Bulk create documents
   * @param {Array} documents - Array of documents to create
   * @param {Object} options - Bulk options
   * @returns {Promise<Object>} Bulk result
   */
  async bulkCreate(documents, options = {}) {
    try {
      return await this.model.insertMany(documents, options);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(ERROR_MESSAGES.DUPLICATE_ENTRY);
      }
      throw error;
    }
  }

  /**
   * Bulk update documents
   * @param {Array} operations - Array of update operations
   * @param {Object} options - Bulk options
   * @returns {Promise<Object>} Bulk result
   */
  async bulkUpdate(operations, options = {}) {
    return await this.model.bulkWrite(operations, options);
  }

  /**
   * Get distinct values for a field
   * @param {String} field - Field name
   * @param {Object} query - Query object
   * @returns {Promise<Array>} Distinct values
   */
  async getDistinct(field, query = {}) {
    return await this.model.distinct(field, query);
  }
}

module.exports = BaseRepository;