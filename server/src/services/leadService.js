const Lead = require('../models/Lead');
const logger = require('../utils/logger');

/**
 * Lead Service - Business logic for leads
 */
class LeadService {
  /**
   * Create lead
   * @param {object} leadData - Lead data
   * @returns {object} - Created lead
   */
  async createLead(leadData) {
    try {
      const lead = new Lead(leadData);
      await lead.save();
      logger.info(`Lead created: ${lead.email}`);
      return lead;
    } catch (error) {
      logger.error('Create lead error:', error);
      throw error;
    }
  }

  /**
   * Get all leads with filters
   * @param {object} filters - Filter criteria
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {object} - Leads and pagination info
   */
  async getLeads(filters = {}, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      if (filters.status) query.status = filters.status;
      if (filters.assignedTo) query.assignedTo = filters.assignedTo;
      if (filters.source) query.source = filters.source;
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { company: { $regex: filters.search, $options: 'i' } },
        ];
      }

      const leads = await Lead.find(query)
        .populate('assignedTo', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Lead.countDocuments(query);

      return {
        leads,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Get leads error:', error);
      throw error;
    }
  }

  /**
   * Get lead by ID
   * @param {string} leadId - Lead ID
   * @returns {object} - Lead object
   */
  async getLeadById(leadId) {
    try {
      const lead = await Lead.findById(leadId)
        .populate('assignedTo')
        .populate('activities')
        .populate('convertedToDeal');

      if (!lead) {
        throw new Error('Lead not found');
      }

      return lead;
    } catch (error) {
      logger.error('Get lead error:', error);
      throw error;
    }
  }

  /**
   * Update lead
   * @param {string} leadId - Lead ID
   * @param {object} updateData - Update data
   * @returns {object} - Updated lead
   */
  async updateLead(leadId, updateData) {
    try {
      const lead = await Lead.findByIdAndUpdate(leadId, updateData, { new: true }).populate(
        'assignedTo'
      );

      if (!lead) {
        throw new Error('Lead not found');
      }

      logger.info(`Lead updated: ${lead.email}`);
      return lead;
    } catch (error) {
      logger.error('Update lead error:', error);
      throw error;
    }
  }

  /**
   * Delete lead
   * @param {string} leadId - Lead ID
   */
  async deleteLead(leadId) {
    try {
      const lead = await Lead.findByIdAndDelete(leadId);

      if (!lead) {
        throw new Error('Lead not found');
      }

      logger.info(`Lead deleted: ${lead.email}`);
      return { success: true };
    } catch (error) {
      logger.error('Delete lead error:', error);
      throw error;
    }
  }

  /**
   * Get lead statistics
   * @returns {object} - Statistics
   */
  async getLeadStatistics() {
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
          },
        },
      ]);

      return {
        byStatus: stats,
        bySource,
        total: await Lead.countDocuments(),
      };
    } catch (error) {
      logger.error('Get lead statistics error:', error);
      throw error;
    }
  }
}

module.exports = new LeadService();
