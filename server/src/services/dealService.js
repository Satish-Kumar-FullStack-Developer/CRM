const Deal = require('../models/Deal');
const logger = require('../utils/logger');

/**
 * Deal Service - Business logic for deals
 */
class DealService {
  /**
   * Create deal
   * @param {object} dealData - Deal data
   * @returns {object} - Created deal
   */
  async createDeal(dealData) {
    try {
      const deal = new Deal(dealData);
      await deal.save();
      logger.info(`Deal created: ${deal.title}`);
      return deal.populate('owner collaborators lead');
    } catch (error) {
      logger.error('Create deal error:', error);
      throw error;
    }
  }

  /**
   * Get all deals with filters
   * @param {object} filters - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {object} - Deals and pagination info
   */
  async getDeals(filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      if (filters.stage) query.stage = filters.stage;
      if (filters.owner) query.owner = filters.owner;
      if (filters.status) query.status = filters.status;
      if (filters.minValue) query.value = { $gte: filters.minValue };
      if (filters.maxValue) {
        query.value = { ...query.value, $lte: filters.maxValue };
      }

      const deals = await Deal.find(query)
        .populate('owner', 'firstName lastName email')
        .populate('lead', 'firstName lastName email company')
        .populate('collaborators', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Deal.countDocuments(query);

      return {
        deals,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get deals error:', error);
      throw error;
    }
  }

  /**
   * Get deal by ID
   * @param {string} dealId - Deal ID
   * @returns {object} - Deal object
   */
  async getDealById(dealId) {
    try {
      const deal = await Deal.findById(dealId)
        .populate('owner')
        .populate('lead')
        .populate('collaborators')
        .populate('activities');

      if (!deal) {
        throw new Error('Deal not found');
      }

      return deal;
    } catch (error) {
      logger.error('Get deal error:', error);
      throw error;
    }
  }

  /**
   * Update deal
   * @param {string} dealId - Deal ID
   * @param {object} updateData - Update data
   * @returns {object} - Updated deal
   */
  async updateDeal(dealId, updateData) {
    try {
      const deal = await Deal.findByIdAndUpdate(dealId, updateData, { new: true })
        .populate('owner')
        .populate('lead');

      if (!deal) {
        throw new Error('Deal not found');
      }

      logger.info(`Deal updated: ${deal.title}`);
      return deal;
    } catch (error) {
      logger.error('Update deal error:', error);
      throw error;
    }
  }

  /**
   * Get pipeline summary
   * @returns {object} - Pipeline data
   */
  async getPipelineSummary() {
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
          $sort: {
            _id: 1,
          },
        },
      ]);

      const byStatus = await Deal.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$value' },
          },
        },
      ]);

      return {
        byStage: pipeline,
        byStatus,
        totalDealValue: await Deal.aggregate([
          { $group: { _id: null, total: { $sum: '$value' } } },
        ]),
      };
    } catch (error) {
      logger.error('Get pipeline summary error:', error);
      throw error;
    }
  }

  /**
   * Delete deal
   * @param {string} dealId - Deal ID
   */
  async deleteDeal(dealId) {
    try {
      const deal = await Deal.findByIdAndDelete(dealId);

      if (!deal) {
        throw new Error('Deal not found');
      }

      logger.info(`Deal deleted: ${deal.title}`);
      return { success: true };
    } catch (error) {
      logger.error('Delete deal error:', error);
      throw error;
    }
  }
}

module.exports = new DealService();
