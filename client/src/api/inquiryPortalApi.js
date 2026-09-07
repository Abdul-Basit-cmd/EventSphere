import apiClient from './axios';

export const sendInquiry = async (inquiryData) => {
  const response = await apiClient.post('/inquiries', inquiryData);
  return response.data;
};

export const getMyInquiries = async () => {
  const response = await apiClient.get('/inquiries/me');
  return response.data;
};
