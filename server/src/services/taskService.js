const Task = require('../models/Task');
const logger = require('../utils/logger');
const emailService = require('./emailService');

/**
 * Task Service - Business logic for tasks
 */
class TaskService {
  /**
   * Create task
   * @param {object} taskData - Task data
   * @returns {object} - Created task
   */
  async createTask(taskData) {
    try {
      const task = new Task(taskData);
      await task.save();
      logger.info(`Task created: ${task.title}`);
      return task.populate('assignedTo assignedBy lead deal');
    } catch (error) {
      logger.error('Create task error:', error);
      throw error;
    }
  }

  /**
   * Get tasks with filters
   * @param {object} filters - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {object} - Tasks and pagination info
   */
  async getTasks(filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      if (filters.assignedTo) query.assignedTo = filters.assignedTo;
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.type) query.type = filters.type;

      // Get overdue and upcoming tasks
      if (filters.overdue) query.dueDate = { $lt: new Date() };
      if (filters.upcoming) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        query.dueDate = { $gte: new Date(), $lte: tomorrow };
      }

      const tasks = await Task.find(query)
        .populate('assignedTo assignedBy lead deal')
        .sort({ dueDate: 1, priority: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Task.countDocuments(query);

      return {
        tasks,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get tasks error:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   * @param {string} taskId - Task ID
   * @returns {object} - Task object
   */
  async getTaskById(taskId) {
    try {
      const task = await Task.findById(taskId).populate('assignedTo assignedBy lead deal notes.author');

      if (!task) {
        throw new Error('Task not found');
      }

      return task;
    } catch (error) {
      logger.error('Get task error:', error);
      throw error;
    }
  }

  /**
   * Update task
   * @param {string} taskId - Task ID
   * @param {object} updateData - Update data
   * @returns {object} - Updated task
   */
  async updateTask(taskId, updateData) {
    try {
      const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true }).populate(
        'assignedTo'
      );

      if (!task) {
        throw new Error('Task not found');
      }

      logger.info(`Task updated: ${task.title}`);
      return task;
    } catch (error) {
      logger.error('Update task error:', error);
      throw error;
    }
  }

  /**
   * Complete task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   */
  async completeTask(taskId, userId) {
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          status: 'Completed',
          completedAt: new Date(),
          completedBy: userId,
        },
        { new: true }
      );

      if (!task) {
        throw new Error('Task not found');
      }

      logger.info(`Task completed: ${task.title}`);
      return task;
    } catch (error) {
      logger.error('Complete task error:', error);
      throw error;
    }
  }

  /**
   * Add note to task
   * @param {string} taskId - Task ID
   * @param {string} content - Note content
   * @param {string} authorId - Author ID
   */
  async addNote(taskId, content, authorId) {
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          $push: {
            notes: {
              content,
              author: authorId,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      ).populate('notes.author');

      return task;
    } catch (error) {
      logger.error('Add note error:', error);
      throw error;
    }
  }

  /**
   * Get task statistics
   * @returns {object} - Statistics
   */
  async getTaskStatistics() {
    try {
      const stats = await Task.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const byPriority = await Task.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        byStatus: stats,
        byPriority,
        total: await Task.countDocuments(),
      };
    } catch (error) {
      logger.error('Get task statistics error:', error);
      throw error;
    }
  }

  /**
   * Delete task
   * @param {string} taskId - Task ID
   */
  async deleteTask(taskId) {
    try {
      const task = await Task.findByIdAndDelete(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      logger.info(`Task deleted: ${task.title}`);
      return { success: true };
    } catch (error) {
      logger.error('Delete task error:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();
