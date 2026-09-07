import apiClient from './axios';

export const fetchExhibitors = async (status) => {
  const params = status && status !== 'all' ? { status } : {};
  const response = await apiClient.get('/exhibitors', { params });
  return response.data;
};

export const fetchExhibitorById = async (exhibitorId) => {
  const response = await apiClient.get(`/exhibitors/${exhibitorId}`);
  return response.data;
};

export const approveExhibitor = async (exhibitorId) => {
  const response = await apiClient.patch(`/exhibitors/${exhibitorId}/approve`);
  return response.data;
};

export const rejectExhibitor = async (exhibitorId, approvalNote) => {
  const response = await apiClient.patch(`/exhibitors/${exhibitorId}/reject`, {
    approvalNote,
  });
  return response.data;
};

export const reopenExhibitor = async (exhibitorId) => {
  const response = await apiClient.patch(`/exhibitors/${exhibitorId}/reopen`);
  return response.data;
};
