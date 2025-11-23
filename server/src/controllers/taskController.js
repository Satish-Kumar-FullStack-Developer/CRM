const taskService = require('../services/taskService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * Task Controller
 */
class TaskController {
  /**
   * Create task
   */
  async createTask(req, res, next) {
    try {
      const taskData = {
        ...req.body,
        assignedBy: req.user._id,
      };

      const task = await taskService.createTask(taskData);

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      logger.error('Create task error:', error);
      next(error);
    }
  }

  /**
   * Get tasks
   */
  async getTasks(req, res, next) {
    try {
      const { page = 1, limit = 20, assignedTo, status, priority, type, overdue, upcoming } = req.query;

      const filters = {};
      if (assignedTo) filters.assignedTo = assignedTo;
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (type) filters.type = type;
      if (overdue === 'true') filters.overdue = true;
      if (upcoming === 'true') filters.upcoming = true;

      const result = await taskService.getTasks(filters, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error('Get tasks error:', error);
      next(error);
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      logger.error('Get task error:', error);
      next(error);
    }
  }

  /**
   * Update task
   */
  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      logger.error('Update task error:', error);
      next(error);
    }
  }

  /**
   * Complete task
   */
  async completeTask(req, res, next) {
    try {
      const task = await taskService.completeTask(req.params.id, req.user._id);
      res.json({
        success: true,
        data: task,
        message: 'Task completed successfully',
      });
    } catch (error) {
      logger.error('Complete task error:', error);
      next(error);
    }
  }

  /**
   * Add note to task
   */
  async addNote(req, res, next) {
    try {
      const { content } = req.body;
      const task = await taskService.addNote(req.params.id, content, req.user._id);
      res.json({
        success: true,
        data: task,
        message: 'Note added successfully',
      });
    } catch (error) {
      logger.error('Add note error:', error);
      next(error);
    }
  }

  /**
   * Get task statistics
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await taskService.getTaskStatistics();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Get statistics error:', error);
      next(error);
    }
  }

  /**
   * Delete task
   */
  async deleteTask(req, res, next) {
    try {
      await taskService.deleteTask(req.params.id);
      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      logger.error('Delete task error:', error);
      next(error);
    }
  }
}

module.exports = new TaskController();
