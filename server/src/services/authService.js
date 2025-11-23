const User = require('../models/User');
const Role = require('../models/Role');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Authentication Service
 */
class AuthService {
  /**
   * Register new user
   * @param {object} userData - User data
   * @returns {object} - User and token
   */
  async register(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Get default role
      let role = await Role.findOne({ name: 'Sales Rep' });

      const user = new User({
        ...userData,
        role: role?._id,
      });

      await user.save();
      const token = generateToken({ id: user._id, email: user.email });

      logger.info(`New user registered: ${user.email}`);
      return {
        success: true,
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {object} - User and token
   */
  async login(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password').populate('role');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;

        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        }

        await user.save();
        throw new Error('Invalid email or password');
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken({ id: user._id, email: user.email });

      logger.info(`User logged in: ${user.email}`);
      return {
        success: true,
        user: user.toJSON(),
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {object} - User object
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).populate('role');
      if (!user) {
        throw new Error('User not found');
      }
      return user.toJSON();
    } catch (error) {
      logger.error('Get user profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {object} updateData - Update data
   * @returns {object} - Updated user
   */
  async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['firstName', 'lastName', 'phone', 'avatar', 'metadata'];
      const updates = {};

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          updates[field] = updateData[field];
        }
      });

      const user = await User.findByIdAndUpdate(userId, updates, { new: true }).populate('role');

      logger.info(`User profile updated: ${user.email}`);
      return user.toJSON();
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {string} userId - User ID
   * @param {string} oldPassword - Old password
   * @param {string} newPassword - New password
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+password');

      const isPasswordValid = await comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);
      return { success: true };
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
