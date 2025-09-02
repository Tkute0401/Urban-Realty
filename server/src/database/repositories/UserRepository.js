const BaseRepository = require('./BaseRepository');
const User = require('../../models/User');
const { USER_ROLES } = require('../../../constants');

/**
 * User Repository - Handles all user-related database operations
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   * @param {String} email - User email
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} User document
   */
  async findByEmail(email, options = {}) {
    return await this.findOne({ email }, options);
  }

  /**
   * Find user by mobile number
   * @param {String} mobile - User mobile number
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} User document
   */
  async findByMobile(mobile, options = {}) {
    return await this.findOne({ mobile }, options);
  }

  /**
   * Find users by role
   * @param {String} role - User role
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Users with specified role
   */
  async findByRole(role, options = {}) {
    return await this.find({ role }, options);
  }

  /**
   * Find verified users
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Verified users
   */
  async findVerifiedUsers(options = {}) {
    return await this.find({ isVerified: true }, options);
  }

  /**
   * Find users by subscription status
   * @param {String} subscriptionStatus - Subscription status
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Users with specified subscription status
   */
  async findBySubscriptionStatus(subscriptionStatus, options = {}) {
    return await this.find({ subscriptionStatus }, options);
  }

  /**
   * Find active users (created within last 30 days)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Active users
   */
  async findActiveUsers(options = {}) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return await this.find({ 
      createdAt: { $gte: thirtyDaysAgo } 
    }, options);
  }

  /**
   * Search users by name or email
   * @param {String} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Search results
   */
  async searchUsers(searchTerm, options = {}) {
    return await this.search(searchTerm, ['name', 'email'], options);
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    const pipeline = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          agents: { $sum: { $cond: [{ $eq: ['$role', USER_ROLES.AGENT] }, 1, 0] } },
          admins: { $sum: { $cond: [{ $eq: ['$role', USER_ROLES.ADMIN] }, 1, 0] } },
          users: { $sum: { $cond: [{ $eq: ['$role', USER_ROLES.USER] }, 1, 0] } }
        }
      }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
      total: 0,
      verified: 0,
      agents: 0,
      admins: 0,
      users: 0
    };
  }

  /**
   * Get users by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Users created in date range
   */
  async findByDateRange(startDate, endDate, options = {}) {
    return await this.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }, options);
  }

  /**
   * Update user verification status
   * @param {String} userId - User ID
   * @param {Boolean} isVerified - Verification status
   * @returns {Promise<Object|null>} Updated user
   */
  async updateVerificationStatus(userId, isVerified) {
    return await this.updateById(userId, { isVerified });
  }

  /**
   * Update user subscription status
   * @param {String} userId - User ID
   * @param {String} subscriptionStatus - Subscription status
   * @returns {Promise<Object|null>} Updated user
   */
  async updateSubscriptionStatus(userId, subscriptionStatus) {
    return await this.updateById(userId, { subscriptionStatus });
  }

  /**
   * Find users with expired subscriptions
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Users with expired subscriptions
   */
  async findUsersWithExpiredSubscriptions(options = {}) {
    const now = new Date();
    return await this.find({
      'subscription.expiryDate': { $lt: now },
      'subscription.status': { $ne: 'expired' }
    }, options);
  }

  /**
   * Get user dashboard data
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User dashboard data
   */
  async getUserDashboardData(userId) {
    const user = await this.findById(userId, {
      select: 'name email role isVerified subscription createdAt'
    });

    if (!user) {
      return null;
    }

    // Get additional statistics based on user role
    const stats = await this.getUserRoleStats(user.role, userId);
    
    return {
      user,
      stats
    };
  }

  /**
   * Get statistics specific to user role
   * @param {String} role - User role
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Role-specific statistics
   */
  async getUserRoleStats(role, userId) {
    // This would be implemented based on specific role requirements
    // For now, return basic stats
    return {
      totalProperties: 0,
      activeListings: 0,
      totalViews: 0,
      inquiries: 0
    };
  }

  /**
   * Bulk update user roles
   * @param {Array} userIds - Array of user IDs
   * @param {String} role - New role
   * @returns {Promise<Object>} Update result
   */
  async bulkUpdateRoles(userIds, role) {
    return await this.updateMany(
      { _id: { $in: userIds } },
      { role }
    );
  }

  /**
   * Find users by multiple criteria
   * @param {Object} criteria - Search criteria
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Matching users
   */
  async findByMultipleCriteria(criteria, options = {}) {
    const query = this.buildAdvancedQuery(criteria);
    return await this.find(query, options);
  }

  /**
   * Build advanced query for complex searches
   * @param {Object} criteria - Search criteria
   * @returns {Object} MongoDB query
   */
  buildAdvancedQuery(criteria) {
    const query = {};

    if (criteria.role) {
      query.role = criteria.role;
    }

    if (criteria.isVerified !== undefined) {
      query.isVerified = criteria.isVerified;
    }

    if (criteria.subscriptionStatus) {
      query.subscriptionStatus = criteria.subscriptionStatus;
    }

    if (criteria.dateRange) {
      query.createdAt = {
        $gte: criteria.dateRange.start,
        $lte: criteria.dateRange.end
      };
    }

    if (criteria.search) {
      query.$or = [
        { name: { $regex: criteria.search, $options: 'i' } },
        { email: { $regex: criteria.search, $options: 'i' } }
      ];
    }

    return query;
  }
}

module.exports = UserRepository;