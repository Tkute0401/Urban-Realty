const mongoose = require('mongoose');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../../constants');

/**
 * Database utility functions for common operations
 */
class DatabaseUtils {
  /**
   * Check if MongoDB connection is healthy
   * @returns {Promise<Object>} Connection status
   */
  static async checkConnection() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };

      return {
        status: states[state] || 'unknown',
        readyState: state,
        isConnected: state === 1,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      };
    } catch (error) {
      return {
        status: 'error',
        isConnected: false,
        error: error.message
      };
    }
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database statistics
   */
  static async getDatabaseStats() {
    try {
      const db = mongoose.connection.db;
      const stats = await db.stats();
      
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }

  /**
   * Get collection statistics
   * @param {String} collectionName - Collection name
   * @returns {Promise<Object>} Collection statistics
   */
  static async getCollectionStats(collectionName) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      const stats = await collection.stats();
      
      return {
        count: stats.count,
        size: stats.size,
        avgObjSize: stats.avgObjSize,
        storageSize: stats.storageSize,
        totalIndexSize: stats.totalIndexSize,
        indexSizes: stats.indexSizes
      };
    } catch (error) {
      throw new Error(`Failed to get collection stats for ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Create database indexes for better performance
   * @param {String} collectionName - Collection name
   * @param {Array} indexes - Array of index specifications
   * @returns {Promise<Array>} Created indexes
   */
  static async createIndexes(collectionName, indexes) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      const results = [];
      for (const index of indexes) {
        const result = await collection.createIndex(index.keys, index.options || {});
        results.push(result);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Failed to create indexes for ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Drop database indexes
   * @param {String} collectionName - Collection name
   * @param {Array} indexNames - Array of index names to drop
   * @returns {Promise<Object>} Drop result
   */
  static async dropIndexes(collectionName, indexNames) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      return await collection.dropIndexes(indexNames);
    } catch (error) {
      throw new Error(`Failed to drop indexes for ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Get all indexes for a collection
   * @param {String} collectionName - Collection name
   * @returns {Promise<Array>} Collection indexes
   */
  static async getIndexes(collectionName) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      return await collection.indexes();
    } catch (error) {
      throw new Error(`Failed to get indexes for ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Perform database backup (export data)
   * @param {String} collectionName - Collection name
   * @param {Object} query - Query to filter documents
   * @returns {Promise<Array>} Exported documents
   */
  static async exportCollection(collectionName, query = {}) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      return await collection.find(query).toArray();
    } catch (error) {
      throw new Error(`Failed to export collection ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Import data into collection
   * @param {String} collectionName - Collection name
   * @param {Array} documents - Documents to import
   * @param {Object} options - Import options
   * @returns {Promise<Object>} Import result
   */
  static async importCollection(collectionName, documents, options = {}) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      if (options.upsert) {
        const bulkOps = documents.map(doc => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: doc },
            upsert: true
          }
        }));
        
        return await collection.bulkWrite(bulkOps);
      } else {
        return await collection.insertMany(documents, options);
      }
    } catch (error) {
      throw new Error(`Failed to import collection ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Clean up old documents from collection
   * @param {String} collectionName - Collection name
   * @param {Object} criteria - Cleanup criteria
   * @returns {Promise<Object>} Cleanup result
   */
  static async cleanupOldDocuments(collectionName, criteria) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      return await collection.deleteMany(criteria);
    } catch (error) {
      throw new Error(`Failed to cleanup collection ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Optimize collection (compact and rebuild indexes)
   * @param {String} collectionName - Collection name
   * @returns {Promise<Object>} Optimization result
   */
  static async optimizeCollection(collectionName) {
    try {
      const db = mongoose.connection.db;
      const collection = db.collection(collectionName);
      
      // Rebuild indexes
      await collection.reIndex();
      
      // Get stats before and after
      const statsBefore = await collection.stats();
      
      return {
        success: true,
        statsBefore,
        message: `Collection ${collectionName} optimized successfully`
      };
    } catch (error) {
      throw new Error(`Failed to optimize collection ${collectionName}: ${error.message}`);
    }
  }

  /**
   * Validate database connection and return health status
   * @returns {Promise<Object>} Health status
   */
  static async getHealthStatus() {
    try {
      const connectionStatus = await this.checkConnection();
      const dbStats = await this.getDatabaseStats();
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connection: connectionStatus,
        database: {
          collections: dbStats.collections,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          objects: dbStats.objects
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  /**
   * Get slow query logs (if available)
   * @returns {Promise<Array>} Slow query logs
   */
  static async getSlowQueries() {
    try {
      const db = mongoose.connection.db;
      const profiler = db.collection('system.profile');
      
      return await profiler.find({}).sort({ ts: -1 }).limit(100).toArray();
    } catch (error) {
      // Profiler might not be enabled
      return [];
    }
  }

  /**
   * Enable query profiling
   * @param {Number} slowMs - Slow query threshold in milliseconds
   * @returns {Promise<Object>} Profiling result
   */
  static async enableProfiling(slowMs = 100) {
    try {
      const db = mongoose.connection.db;
      
      await db.command({
        profile: 2,
        slowms: slowMs
      });
      
      return {
        success: true,
        message: `Query profiling enabled with ${slowMs}ms threshold`
      };
    } catch (error) {
      throw new Error(`Failed to enable profiling: ${error.message}`);
    }
  }

  /**
   * Disable query profiling
   * @returns {Promise<Object>} Profiling result
   */
  static async disableProfiling() {
    try {
      const db = mongoose.connection.db;
      
      await db.command({
        profile: 0
      });
      
      return {
        success: true,
        message: 'Query profiling disabled'
      };
    } catch (error) {
      throw new Error(`Failed to disable profiling: ${error.message}`);
    }
  }

  /**
   * Get database performance metrics
   * @returns {Promise<Object>} Performance metrics
   */
  static async getPerformanceMetrics() {
    try {
      const db = mongoose.connection.db;
      const serverStatus = await db.admin().serverStatus();
      
      return {
        uptime: serverStatus.uptime,
        connections: serverStatus.connections,
        network: serverStatus.network,
        opcounters: serverStatus.opcounters,
        mem: serverStatus.mem,
        metrics: serverStatus.metrics
      };
    } catch (error) {
      throw new Error(`Failed to get performance metrics: ${error.message}`);
    }
  }
}

module.exports = DatabaseUtils;