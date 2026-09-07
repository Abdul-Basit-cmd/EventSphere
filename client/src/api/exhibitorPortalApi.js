import apiClient from './axios';

export const getMyProfile = async () => {
  const response = await apiClient.get('/exhibitors/me');
  return response.data;
};

export const createProfile = async (profileData) => {
  const response = await apiClient.post('/exhibitors/me', profileData);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.patch('/exhibitors/me', profileData);
  return response.data;
};

export const submitProfile = async (profileData = {}) => {
  const response = await apiClient.patch('/exhibitors/me/submit', profileData);
  return response.data;
};

export const getMyBooths = async () => {
  const response = await apiClient.get('/exhibitors/me/booths');
  return response.data;
};

export const getNeighbors = async () => {
  const response = await apiClient.get('/exhibitors/me/neighbors');
  return response.data;
};

export const getDashboard = async () => {
  try {
    const response = await apiClient.get('/exhibitors/me/dashboard');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        status: 'Ok',
        data: {
          profileStatus: {
            onboardingComplete: false,
            approvalStatus: 'draft',
          },
          booths: [],
          unreadInquiries: 0,
        },
      };
    }
    throw error;
  }
};
