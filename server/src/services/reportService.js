const Report = require('../models/Report');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Task = require('../models/Task');
const logger = require('../utils/logger');

/**
 * Report Service - Business logic for analytics and reports
 */
class ReportService {
  /**
   * Generate sales pipeline report
   * @returns {object} - Report data
   */
  async generateSalesPipelineReport() {
    try {
      const pipeline = await Deal.aggregate([
        {
          $group: {
            _id: '$stage',
            count: { $sum: 1 },
            totalValue: { $sum: '$value' },
            avgProbability: { $avg: '$probability' },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      return {
        type: 'Sales Pipeline',
        data: pipeline,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Generate pipeline report error:', error);
      throw error;
    }
  }

  /**
   * Generate lead conversion report
   * @returns {object} - Report data
   */
  async generateLeadConversionReport() {
    try {
      const stats = await Lead.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const bySource = await Lead.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 },
            qualified: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0],
              },
            },
          },
        },
      ]);

      const conversionRate = (
        (stats.find((s) => s._id === 'Qualified')?.count || 0) /
        (stats.reduce((sum, s) => sum + s.count, 0) || 1)
      ).toFixed(2);

      return {
        type: 'Lead Conversion',
        byStatus: stats,
        bySource,
        conversionRate: `${conversionRate * 100}%`,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Generate lead conversion report error:', error);
      throw error;
    }
  }

  /**
   * Generate deal analytics report
   * @returns {object} - Report data
   */
  async generateDealAnalyticsReport() {
    try {
      const byOwner = await Deal.aggregate([
        {
          $group: {
            _id: '$owner',
            count: { $sum: 1 },
            totalValue: { $sum: '$value' },
            avgValue: { $avg: '$value' },
            wonCount: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Won'] }, 1, 0],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'ownerInfo',
          },
        },
      ]);

      const totalValue = await Deal.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$value' },
            avgDealSize: { $avg: '$value' },
            wonValue: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0],
              },
            },
          },
        },
      ]);

      return {
        type: 'Deal Analytics',
        byOwner,
        summary: totalValue[0],
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Generate deal analytics report error:', error);
      throw error;
    }
  }

  /**
   * Generate team performance report
   * @returns {object} - Report data
   */
  async generateTeamPerformanceReport() {
    try {
      const dealsWon = await Deal.aggregate([
        { $match: { status: 'Won' } },
        {
          $group: {
            _id: '$owner',
            count: { $sum: 1 },
            totalValue: { $sum: '$value' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        { $sort: { totalValue: -1 } },
      ]);

      const leadsAssigned = await Lead.aggregate([
        {
          $group: {
            _id: '$assignedTo',
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        type: 'Team Performance',
        dealsWon,
        leadsAssigned,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Generate team performance report error:', error);
      throw error;
    }
  }

  /**
   * Get dashboard analytics
   * @returns {object} - Dashboard data
   */
  async getDashboardAnalytics() {
    try {
      const [leadStats, dealStats, taskStats, pipelineData] = await Promise.all([
        Lead.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              qualified: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0],
                },
              },
            },
          },
        ]),
        Deal.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              totalValue: { $sum: '$value' },
              wonCount: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Won'] }, 1, 0],
                },
              },
              wonValue: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0],
                },
              },
            },
          },
        ]),
        Task.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0],
                },
              },
              overdue: {
                $sum: {
                  $cond: [{ $lt: ['$dueDate', new Date()] }, 1, 0],
                },
              },
            },
          },
        ]),
        this.generateSalesPipelineReport(),
      ]);

      return {
        leads: leadStats[0],
        deals: dealStats[0],
        tasks: taskStats[0],
        pipeline: pipelineData,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Get dashboard analytics error:', error);
      throw error;
    }
  }
}

module.exports = new ReportService();
