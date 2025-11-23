const dealService = require('../services/dealService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * Normalize stage value to match schema enum
 */
const normalizeStage = (stage) => {
  if (!stage) return 'Prospecting';
  const stageMap = {
    prospecting: 'Prospecting',
    qualification: 'Qualification',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed: 'Closed Won',
  };
  return stageMap[stage.toLowerCase()] || 'Prospecting';
};

/**
 * Deal Controller
 */
class DealController {
  /**
   * Create deal
   */
  async createDeal(req, res, next) {
    try {
      const dealData = {
        ...req.body,
        owner: req.body.owner || req.user._id,
        stage: normalizeStage(req.body.stage),
      };

      const deal = await dealService.createDeal(dealData);

      // Send notification email
      try {
        await emailService.sendDealNotification(req.user.email, deal, 'created');
      } catch (emailError) {
        logger.error('Failed to send email notification:', emailError);
      }

      res.status(201).json({
        success: true,
        data: deal,
      });
    } catch (error) {
      logger.error('Create deal error:', error);
      next(error);
    }
  }

  /**
   * Get all deals
   */
  async getDeals(req, res, next) {
    try {
      const { page = 1, limit = 20, stage, owner, status, minValue, maxValue } = req.query;

      const filters = {};
      if (stage) filters.stage = normalizeStage(stage);
      if (owner) filters.owner = owner;
      if (status) filters.status = status;
      if (minValue) filters.minValue = parseInt(minValue);
      if (maxValue) filters.maxValue = parseInt(maxValue);

      const result = await dealService.getDeals(filters, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error('Get deals error:', error);
      next(error);
    }
  }

  /**
   * Get deal by ID
   */
  async getDealById(req, res, next) {
    try {
      const deal = await dealService.getDealById(req.params.id);
      res.json({
        success: true,
        data: deal,
      });
    } catch (error) {
      logger.error('Get deal error:', error);
      next(error);
    }
  }

  /**
   * Update deal
   */
  async updateDeal(req, res, next) {
    try {
      const updateData = { ...req.body };
      if (updateData.stage) {
        updateData.stage = normalizeStage(updateData.stage);
      }
      
      const deal = await dealService.updateDeal(req.params.id, updateData);
      res.json({
        success: true,
        data: deal,
      });
    } catch (error) {
      logger.error('Update deal error:', error);
      next(error);
    }
  }

  /**
   * Get pipeline summary
   */
  async getPipelineSummary(req, res, next) {
    try {
      const summary = await dealService.getPipelineSummary();
      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      logger.error('Get pipeline summary error:', error);
      next(error);
    }
  }

  /**
   * Delete deal
   */
  async deleteDeal(req, res, next) {
    try {
      await dealService.deleteDeal(req.params.id);
      res.json({
        success: true,
        message: 'Deal deleted successfully',
      });
    } catch (error) {
      logger.error('Delete deal error:', error);
      next(error);
    }
  }
}

module.exports = new DealController();
