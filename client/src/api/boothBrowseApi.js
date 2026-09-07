import apiClient from './axios';

export const getExpoBooths = async (expoId) => {
  const response = await apiClient.get(`/expos/${expoId}/booths`);
  return response.data;
};

export const reserveBooth = async (expoId, boothId) => {
  const response = await apiClient.post(`/expos/${expoId}/booths/${boothId}/reserve`);
  return response.data;
};
