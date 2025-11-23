import apiClient from './apiClient';

/**
 * Task Service
 */
const taskService = {
  getTasks: (params) => apiClient.get('/tasks', { params }),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  createTask: (taskData) => apiClient.post('/tasks', taskData),
  updateTask: (id, taskData) => apiClient.put(`/tasks/${id}`, taskData),
  completeTask: (id) => apiClient.patch(`/tasks/${id}/complete`),
  addNote: (id, content) => apiClient.post(`/tasks/${id}/notes`, { content }),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  getStatistics: () => apiClient.get('/tasks/statistics'),
};

export default taskService;
