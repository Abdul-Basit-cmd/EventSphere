import apiClient from './axios';

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const verifyEmailApi = async (verificationData) => {
  const response = await apiClient.post('/auth/verify-email', verificationData);
  return response.data;
};

export const resendVerificationApi = async (emailData) => {
  const response = await apiClient.post('/auth/resend-verification', emailData);
  return response.data;
};

export const refreshTokenApi = async () => {
  const response = await apiClient.post('/auth/refresh');
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const forgotPasswordApi = async (emailData) => {
  const response = await apiClient.post('/auth/forgot-password', emailData);
  return response.data;
};

export const resetPasswordApi = async (resetData) => {
  const response = await apiClient.post('/auth/reset-password', resetData);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
