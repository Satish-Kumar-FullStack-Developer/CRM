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

  /**
   * Delete user account
   * @param {string} userId - User ID
   */
  async deleteAccount(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Delete all user's data
      const Lead = require('../models/Lead');
      const Deal = require('../models/Deal');
      const Task = require('../models/Task');

      // Delete leads assigned to user
      await Lead.deleteMany({ assignedTo: userId });

      // Delete deals owned by user
      await Deal.deleteMany({ owner: userId });

      // Delete tasks assigned to user
      await Task.deleteMany({ assignedTo: userId });

      // Delete user account
      await User.findByIdAndDelete(userId);

      logger.info(`User account deleted: ${user.email}`);
      return { success: true };
    } catch (error) {
      logger.error('Delete account error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email with token-based link
   * @param {string} email - User email
   */
  async sendPasswordResetEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // For security, don't reveal if user exists
        logger.warn(`Password reset requested for non-existent email: ${email}`);
        return { success: true };
      }

      // Generate unique reset token (32 characters)
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(16).toString('hex');
      
      // Hash token for storage
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Set token to expire in 1 hour
      user.resetToken = resetTokenHash;
      user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      logger.info(`Password reset token generated for ${email}, expires at ${user.resetTokenExpires}`);

      // Send email with reset link
      const emailService = require('./emailService');
      
      try {
        // Use the plain token in the link (not the hash)
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        await emailService.sendPasswordResetEmail(email, resetLink);
        logger.info(`Password reset email sent to: ${email}`);
      } catch (emailError) {
        logger.warn(`Failed to send password reset email to ${email}:`, emailError.message);
        // Still return success - token was created even if email failed
      }

      return { success: true };
    } catch (error) {
      logger.error('Send password reset email error:', error);
      throw error;
    }
  }

  /**
   * Reset password using token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   */
  async resetPasswordWithToken(token, newPassword) {
    try {
      const crypto = require('crypto');
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        resetToken: resetTokenHash,
        resetTokenExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new Error('Invalid or expired password reset token');
      }

      // Update password
      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      user.lastPasswordReset = new Date();
      await user.save();

      logger.info(`Password reset successfully for user: ${user.email}`);
      return { success: true };
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
