const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const Role = require('../models/Role');
const logger = require('../utils/logger');

/**
 * Authentication middleware - Verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required',
      });
    }

    const decoded = verifyToken(token);
    let user = await User.findById(decoded.id).populate('role');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    // Auto-assign role if user doesn't have one
    if (!user.role) {
      const defaultRole = await Role.findOne({ name: 'Sales Rep' });
      if (defaultRole) {
        user.role = defaultRole._id;
        await User.findByIdAndUpdate(decoded.id, { role: defaultRole._id });
        user = await User.findById(decoded.id).populate('role');
      }
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = authenticate;
