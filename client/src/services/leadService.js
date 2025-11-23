import apiClient from './apiClient';

/**
 * Lead Service
 */
const leadService = {
  getLeads: (params) => apiClient.get('/leads', { params }),
  getLeadById: (id) => apiClient.get(`/leads/${id}`),
  createLead: (leadData) => apiClient.post('/leads', leadData),
  updateLead: (id, leadData) => apiClient.put(`/leads/${id}`, leadData),
  deleteLead: (id) => apiClient.delete(`/leads/${id}`),
  getStatistics: () => apiClient.get('/leads/statistics'),
};

export default leadService;
