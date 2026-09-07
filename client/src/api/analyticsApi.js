import apiClient from './axios';

export const fetchAnalytics = async (expoId = '') => {
  const params = expoId ? { expoId } : {};
  const response = await apiClient.get('/analytics', { params });
  return response.data;
};
