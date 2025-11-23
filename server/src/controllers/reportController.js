const reportService = require('../services/reportService');
const logger = require('../utils/logger');

/**
 * Report Controller
 */
class ReportController {
  /**
   * Get dashboard analytics
   */
  async getDashboardAnalytics(req, res, next) {
    try {
      const analytics = await reportService.getDashboardAnalytics();
      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Get dashboard analytics error:', error);
      next(error);
    }
  }

  /**
   * Get sales pipeline report
   */
  async getSalesPipelineReport(req, res, next) {
    try {
      const report = await reportService.generateSalesPipelineReport();
      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Get pipeline report error:', error);
      next(error);
    }
  }

  /**
   * Get lead conversion report
   */
  async getLeadConversionReport(req, res, next) {
    try {
      const report = await reportService.generateLeadConversionReport();
      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Get lead conversion report error:', error);
      next(error);
    }
  }

  /**
   * Get deal analytics report
   */
  async getDealAnalyticsReport(req, res, next) {
    try {
      const report = await reportService.generateDealAnalyticsReport();
      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Get deal analytics report error:', error);
      next(error);
    }
  }

  /**
   * Get team performance report
   */
  async getTeamPerformanceReport(req, res, next) {
    try {
      const report = await reportService.generateTeamPerformanceReport();
      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      logger.error('Get team performance report error:', error);
      next(error);
    }
  }
}

module.exports = new ReportController();
