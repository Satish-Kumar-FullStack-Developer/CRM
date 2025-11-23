const logger = require('../utils/logger');

/**
 * Authorization middleware - Check user permissions
 * @param {string} resource - Resource name (leads, deals, tasks, etc)
 * @param {string} action - Action (create, read, update, delete)
 */
const authorize = (resource, action) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Admin has all permissions
      if (user.role?.name === 'Admin') {
        return next();
      }

      // Check role-based permissions
      const rolePermissions = user.role?.permissions;

      if (!rolePermissions || !rolePermissions[resource]) {
        return res.status(403).json({
          success: false,
          message: `No permissions for ${resource}`,
        });
      }

      if (!rolePermissions[resource][action]) {
        return res.status(403).json({
          success: false,
          message: `No permission to ${action} ${resource}`,
        });
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization error',
      });
    }
  };
};

module.exports = authorize;
