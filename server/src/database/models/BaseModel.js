const mongoose = require('mongoose');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../../constants');

/**
 * Base Model Class with common CRUD operations
 * All models should extend this class for consistent behavior
 */
class BaseModel {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(ERROR_MESSAGES.DUPLICATE_ENTRY);
      }
      throw error;
    }
  }

  /**
   * Find document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found document
   */
  async findById(id, options = {}) {
    try {
      return await this.model.findById(id, options.select, options);
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find one document by query
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Found document
   */
  async findOne(query, options = {}) {
    return await this.model.findOne(query, options.select, options);
  }

  /**
   * Find multiple documents
   * @param {Object} query - Query object
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Found documents
   */
  async find(query = {}, options = {}) {
    return await this.model.find(query, options.select, options);
  }

  /**
   * Find documents with pagination
   * @param {Object} query - Query object
   * @param {Object} pagination - Pagination options
   * @param {Object} options - Additional query options
   * @returns {Promise<Object>} Paginated results
   */
  async findWithPagination(query = {}, pagination = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = pagination;
    const { PAGINATION } = require('../../constants');
    
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(limit, PAGINATION.MAX_LIMIT);
    
    const [documents, total] = await Promise.all([
      this.model.find(query, options.select, { ...options, skip, limit: maxLimit, sort }),
      this.model.countDocuments(query)
    ]);

    return {
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: maxLimit,
        total,
        pages: Math.ceil(total / maxLimit),
        hasNext: page < Math.ceil(total / maxLimit),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Update document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated document
   */
  async updateById(id, data, options = {}) {
    try {
      const document = await this.model.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true, ...options }
      );
      return document;
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update one document by query
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object|null>} Updated document
   */
  async updateOne(query, data, options = {}) {
    return await this.model.findOneAndUpdate(
      query,
      data,
      { new: true, runValidators: true, ...options }
    );
  }

  /**
   * Update multiple documents
   * @param {Object} query - Query object
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Update result
   */
  async updateMany(query, data, options = {}) {
    return await this.model.updateMany(query, data, options);
  }

  /**
   * Delete document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Delete options
   * @returns {Promise<Object|null>} Deleted document
   */
  async deleteById(id, options = {}) {
    try {
      return await this.model.findByIdAndDelete(id, options);
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete one document by query
   * @param {Object} query - Query object
   * @param {Object} options - Delete options
   * @returns {Promise<Object|null>} Deleted document
   */
  async deleteOne(query, options = {}) {
    return await this.model.findOneAndDelete(query, options);
  }

  /**
   * Delete multiple documents
   * @param {Object} query - Query object
   * @param {Object} options - Delete options
   * @returns {Promise<Object>} Delete result
   */
  async deleteMany(query, options = {}) {
    return await this.model.deleteMany(query, options);
  }

  /**
   * Count documents
   * @param {Object} query - Query object
   * @returns {Promise<Number>} Document count
   */
  async count(query = {}) {
    return await this.model.countDocuments(query);
  }

  /**
   * Check if document exists
   * @param {Object} query - Query object
   * @returns {Promise<Boolean>} Existence status
   */
  async exists(query) {
    const count = await this.model.countDocuments(query);
    return count > 0;
  }

  /**
   * Aggregate documents
   * @param {Array} pipeline - Aggregation pipeline
   * @returns {Promise<Array>} Aggregated results
   */
  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline);
  }

  /**
   * Create index
   * @param {Object} index - Index specification
   * @param {Object} options - Index options
   * @returns {Promise<String>} Index name
   */
  async createIndex(index, options = {}) {
    return await this.model.createIndex(index, options);
  }

  /**
   * Get model statistics
   * @returns {Promise<Object>} Model statistics
   */
  async getStats() {
    const [total, recent] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    ]);

    return {
      total,
      recent,
      model: this.model.modelName
    };
  }
}

module.exports = BaseModel;