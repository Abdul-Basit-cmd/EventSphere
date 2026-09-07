import apiClient from './axios';

export const fetchExpos = async (params = {}) => {
  const response = await apiClient.get('/expos', { params });
  return response.data;
};

export const fetchExpoById = async (expoId) => {
  const response = await apiClient.get(`/expos/${expoId}`);
  return response.data;
};

export const createExpo = async (expoData) => {
  const response = await apiClient.post('/expos', expoData);
  return response.data;
};

export const updateExpo = async (expoId, expoData) => {
  const response = await apiClient.patch(`/expos/${expoId}`, expoData);
  return response.data;
};

export const deleteExpo = async (expoId) => {
  const response = await apiClient.delete(`/expos/${expoId}`);
  return response.data;
};

// Aliases for Exhibitor browsing
export const getExpos = fetchExpos;
export const getExpoById = fetchExpoById;

