import apiClient from './axios';

export const registerForExpo = async (expoId) => {
  const response = await apiClient.post(`/expos/${expoId}/registrations`);
  return response.data;
};

export const toggleBookmark = async (expoId, sessionId) => {
  const response = await apiClient.post(`/expos/${expoId}/sessions/${sessionId}/bookmark`);
  return response.data;
};

export const getMySchedule = async () => {
  const response = await apiClient.get('/attendees/me/schedule');
  return response.data;
};

export const recordBoothVisit = async (expoId, boothId) => {
  const response = await apiClient.post(`/expos/${expoId}/booths/${boothId}/visits`);
  return response.data;
};
