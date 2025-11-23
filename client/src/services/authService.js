import apiClient from './apiClient';

/**
 * Authentication Service
 */
const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData),
  changePassword: (oldPassword, newPassword) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),
  deleteAccount: () => apiClient.delete('/auth/delete-account'),
  requestPasswordReset: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => apiClient.post('/auth/reset-password', { token, newPassword }),
};

export default authService;
