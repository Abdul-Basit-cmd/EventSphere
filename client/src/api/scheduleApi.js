import apiClient from './axios';

export const fetchSessions = async (expoId) => {
  const response = await apiClient.get(`/expos/${expoId}/sessions`);
  return response.data;
};

export const fetchSessionById = async (expoId, sessionId) => {
  const response = await apiClient.get(`/expos/${expoId}/sessions/${sessionId}`);
  return response.data;
};

export const createSession = async (expoId, sessionData) => {
  const response = await apiClient.post(`/expos/${expoId}/sessions`, sessionData);
  return response.data;
};

export const updateSession = async (expoId, sessionId, sessionData) => {
  const response = await apiClient.patch(`/expos/${expoId}/sessions/${sessionId}`, sessionData);
  return response.data;
};

export const deleteSession = async (expoId, sessionId) => {
  const response = await apiClient.delete(`/expos/${expoId}/sessions/${sessionId}`);
  return response.data;
};
