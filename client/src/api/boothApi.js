import apiClient from './axios';

export const fetchBooths = async (expoId) => {
  const response = await apiClient.get(`/expos/${expoId}/booths`);
  return response.data;
};

export const fetchBoothById = async (expoId, boothId) => {
  const response = await apiClient.get(`/expos/${expoId}/booths/${boothId}`);
  return response.data;
};

export const createBooth = async (expoId, boothData) => {
  const response = await apiClient.post(`/expos/${expoId}/booths`, boothData);
  return response.data;
};

export const updateBooth = async (expoId, boothId, boothData) => {
  const response = await apiClient.patch(`/expos/${expoId}/booths/${boothId}`, boothData);
  return response.data;
};

export const deleteBooth = async (expoId, boothId) => {
  const response = await apiClient.delete(`/expos/${expoId}/booths/${boothId}`);
  return response.data;
};

export const assignBooth = async (expoId, boothId, exhibitorProfileId) => {
  const response = await apiClient.patch(`/expos/${expoId}/booths/${boothId}/assign`, {
    exhibitorProfileId,
  });
  return response.data;
};

export const unassignBooth = async (expoId, boothId) => {
  const response = await apiClient.patch(`/expos/${expoId}/booths/${boothId}/unassign`);
  return response.data;
};
