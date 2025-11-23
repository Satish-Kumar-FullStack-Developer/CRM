import apiClient from './apiClient';

/**
 * Deal Service
 */
const dealService = {
  getDeals: (params) => apiClient.get('/deals', { params }),
  getDealById: (id) => apiClient.get(`/deals/${id}`),
  createDeal: (dealData) => apiClient.post('/deals', dealData),
  updateDeal: (id, dealData) => apiClient.put(`/deals/${id}`, dealData),
  deleteDeal: (id) => apiClient.delete(`/deals/${id}`),
  getPipelineSummary: () => apiClient.get('/deals/pipeline/summary'),
};

export default dealService;
