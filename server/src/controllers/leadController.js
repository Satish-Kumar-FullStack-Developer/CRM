const leadService = require('../services/leadService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * Lead Controller
 */
class LeadController {
  /**
   * Create lead
   */
  async createLead(req, res, next) {
    try {
      const lead = await leadService.createLead({
        ...req.body,
        assignedTo: req.body.assignedTo || req.user._id,
      });

      // Send notification email
      try {
        await emailService.sendLeadNotification(lead.email, lead, 'created');
      } catch (emailError) {
        logger.error('Failed to send email notification:', emailError);
      }

      res.status(201).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      logger.error('Create lead error:', error);
      next(error);
    }
  }

  /**
   * Get all leads
   */
  async getLeads(req, res, next) {
    try {
      const { page = 1, limit = 20, status, assignedTo, source, search } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (assignedTo) filters.assignedTo = assignedTo;
      if (source) filters.source = source;
      if (search) filters.search = search;

      const result = await leadService.getLeads(filters, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error('Get leads error:', error);
      next(error);
    }
  }

  /**
   * Get lead by ID
   */
  async getLeadById(req, res, next) {
    try {
      const lead = await leadService.getLeadById(req.params.id);
      res.json({
        success: true,
        data: lead,
      });
    } catch (error) {
      logger.error('Get lead error:', error);
      next(error);
    }
  }

  /**
   * Update lead
   */
  async updateLead(req, res, next) {
    try {
      const lead = await leadService.updateLead(req.params.id, req.body);
      res.json({
        success: true,
        data: lead,
      });
    } catch (error) {
      logger.error('Update lead error:', error);
      next(error);
    }
  }

  /**
   * Delete lead
   */
  async deleteLead(req, res, next) {
    try {
      await leadService.deleteLead(req.params.id);
      res.json({
        success: true,
        message: 'Lead deleted successfully',
      });
    } catch (error) {
      logger.error('Delete lead error:', error);
      next(error);
    }
  }

  /**
   * Get lead statistics
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await leadService.getLeadStatistics();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Get statistics error:', error);
      next(error);
    }
  }
}

module.exports = new LeadController();
