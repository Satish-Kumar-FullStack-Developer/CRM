import apiClient from './apiClient';

/**
 * Report Service
 */
const reportService = {
  getDashboardAnalytics: () => apiClient.get('/reports/dashboard'),
  getSalesPipelineReport: () => apiClient.get('/reports/pipeline'),
  getLeadConversionReport: () => apiClient.get('/reports/conversion'),
  getDealAnalyticsReport: () => apiClient.get('/reports/deals'),
  getTeamPerformanceReport: () => apiClient.get('/reports/team'),
};

export default reportService;
