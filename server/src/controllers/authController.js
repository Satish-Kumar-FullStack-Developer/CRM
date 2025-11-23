const authService = require('../services/authService');
const logger = require('../utils/logger');

/**
 * Auth Controller
 */
class AuthController {
  /**
   * Register user
   */
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Register error:', error);
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserProfile(req.user._id);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.user._id, req.body);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      next(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(req.user._id, oldPassword, newPassword);
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      logger.error('Change password error:', error);
      next(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(req, res, next) {
    try {
      await authService.deleteAccount(req.user._id);
      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      logger.error('Delete account error:', error);
      next(error);
    }
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.sendPasswordResetEmail(email);
      res.json({
        success: true,
        message: 'Password reset link sent to your email',
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      next(error);
    }
  }
}

module.exports = new AuthController();
