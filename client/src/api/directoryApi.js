import apiClient from './axios';

export const getDirectory = async (params = {}) => {
  const response = await apiClient.get('/exhibitors/directory', { params });
  return response.data;
};
