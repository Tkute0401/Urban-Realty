const BaseService = require('./BaseService');
const UserRepository = require('../database/repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/environment');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, USER_ROLES, JWT_CONFIG } = require('../../constants');

/**
 * User Service - Handles all user-related business logic
 */
class UserService extends BaseService {
  constructor() {
    super(new UserRepository());
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      this.log('register', { email: userData.email });

      // Validate user data
      const validation = this.validateUserData(userData);
      if (!validation.isValid) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validation.errors
        );
      }

      // Check if user already exists
      const existingUser = await this.repository.findByEmail(userData.email);
      if (existingUser) {
        return this.createErrorResponse(
          ERROR_MESSAGES.DUPLICATE_ENTRY,
          HTTP_STATUS.CONFLICT
        );
      }

      // Hash password
      const saltRounds = config.security.bcryptRounds;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await this.repository.create({
        ...userData,
        password: hashedPassword,
        isVerified: false
      });

      // Generate JWT token
      const token = this.generateToken(user._id);

      // Remove password from response
      const userResponse = this.sanitizeUser(user);

      return this.createResponse(
        { user: userResponse, token },
        SUCCESS_MESSAGES.USER_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      this.log('register', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Authenticate user login
   * @param {Object} loginData - Login credentials
   * @returns {Promise<Object>} Login result
   */
  async login(loginData) {
    try {
      this.log('login', { email: loginData.email });

      // Validate login data
      if (!loginData.email || !loginData.password) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          ['Email and password are required']
        );
      }

      // Find user with password
      const user = await this.repository.findByEmail(loginData.email, {
        select: '+password'
      });

      if (!user) {
        return this.createErrorResponse(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Check if account is disabled
      if (user.isDisabled) {
        return this.createErrorResponse(
          ERROR_MESSAGES.ACCOUNT_DISABLED,
          HTTP_STATUS.FORBIDDEN
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return this.createErrorResponse(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      // Generate JWT token
      const token = this.generateToken(user._id);

      // Update last login
      await this.repository.updateById(user._id, { lastLogin: new Date() });

      // Remove password from response
      const userResponse = this.sanitizeUser(user);

      return this.createResponse(
        { user: userResponse, token },
        SUCCESS_MESSAGES.LOGIN_SUCCESS,
        HTTP_STATUS.OK
      );
    } catch (error) {
      this.log('login', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get user profile
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User profile
   */
  async getProfile(userId) {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const userResponse = this.sanitizeUser(user);
      return this.createResponse(userResponse);
    } catch (error) {
      this.log('getProfile', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update user profile
   * @param {String} userId - User ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Update result
   */
  async updateProfile(userId, updateData) {
    try {
      this.log('updateProfile', { userId, fields: Object.keys(updateData) });

      // Remove sensitive fields that shouldn't be updated directly
      const { password, email, role, ...allowedUpdates } = updateData;

      // Validate update data
      const validation = this.validateUserData(allowedUpdates, false);
      if (!validation.isValid) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validation.errors
        );
      }

      const user = await this.repository.updateById(userId, allowedUpdates);
      if (!user) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      const userResponse = this.sanitizeUser(user);
      return this.createResponse(
        userResponse,
        SUCCESS_MESSAGES.USER_UPDATED
      );
    } catch (error) {
      this.log('updateProfile', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Change user password
   * @param {String} userId - User ID
   * @param {Object} passwordData - Password change data
   * @returns {Promise<Object>} Password change result
   */
  async changePassword(userId, passwordData) {
    try {
      this.log('changePassword', { userId });

      const { currentPassword, newPassword } = passwordData;

      if (!currentPassword || !newPassword) {
        return this.createErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          ['Current password and new password are required']
        );
      }

      // Get user with password
      const user = await this.repository.findById(userId, {
        select: '+password'
      });

      if (!user) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return this.createErrorResponse(
          'Current password is incorrect',
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Hash new password
      const saltRounds = config.security.bcryptRounds;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await this.repository.updateById(userId, { password: hashedPassword });

      return this.createResponse(
        null,
        'Password changed successfully'
      );
    } catch (error) {
      this.log('changePassword', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get all users with pagination and filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} Paginated users
   */
  async getUsers(filters = {}, pagination = {}) {
    try {
      this.log('getUsers', { filters, pagination });

      const query = this.buildUserQuery(filters);
      const result = await this.repository.findWithPagination(query, pagination);

      // Sanitize users in response
      const sanitizedUsers = result.data.map(user => this.sanitizeUser(user));

      return this.createResponse({
        users: sanitizedUsers,
        pagination: result.pagination
      });
    } catch (error) {
      this.log('getUsers', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    try {
      const stats = await this.repository.getUserStats();
      return this.createResponse(stats);
    } catch (error) {
      this.log('getUserStats', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteUser(userId) {
    try {
      this.log('deleteUser', { userId });

      const user = await this.repository.deleteById(userId);
      if (!user) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      return this.createResponse(
        null,
        SUCCESS_MESSAGES.USER_DELETED
      );
    } catch (error) {
      this.log('deleteUser', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Verify user email
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Verification result
   */
  async verifyEmail(userId) {
    try {
      this.log('verifyEmail', { userId });

      const user = await this.repository.updateById(userId, { isVerified: true });
      if (!user) {
        return this.createErrorResponse(
          ERROR_MESSAGES.NOT_FOUND,
          HTTP_STATUS.NOT_FOUND
        );
      }

      return this.createResponse(
        this.sanitizeUser(user),
        SUCCESS_MESSAGES.EMAIL_VERIFIED
      );
    } catch (error) {
      this.log('verifyEmail', { error: error.message }, 'error');
      return this.createErrorResponse(
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Generate JWT token
   * @param {String} userId - User ID
   * @returns {String} JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Object} Decoded token
   */
  verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
  }

  /**
   * Sanitize user object (remove sensitive data)
   * @param {Object} user - User object
   * @returns {Object} Sanitized user
   */
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    const { password, __v, ...sanitized } = userObj;
    return sanitized;
  }

  /**
   * Validate user data
   * @param {Object} userData - User data
   * @param {Boolean} isRegistration - Whether this is for registration
   * @returns {Object} Validation result
   */
  validateUserData(userData, isRegistration = true) {
    const rules = {
      name: {
        required: true,
        type: 'string',
        min: 2,
        max: 50
      },
      email: {
        required: true,
        type: 'string',
        pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      },
      mobile: {
        required: false,
        type: 'string',
        pattern: /^\+?[0-9]{10,15}$/
      },
      role: {
        required: false,
        type: 'string'
      }
    };

    if (isRegistration) {
      rules.password = {
        required: true,
        type: 'string',
        min: 6
      };
    }

    return this.validate(userData, rules);
  }

  /**
   * Build user query from filters
   * @param {Object} filters - Filter criteria
   * @returns {Object} MongoDB query
   */
  buildUserQuery(filters) {
    const query = {};

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.isVerified !== undefined) {
      query.isVerified = filters.isVerified;
    }

    if (filters.isDisabled !== undefined) {
      query.isDisabled = filters.isDisabled;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end
      };
    }

    return query;
  }
}

module.exports = UserService;