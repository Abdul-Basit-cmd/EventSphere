import apiClient from './axios';

export const fetchAdminInquiries = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/inquiries/support', {
    params: { page, limit },
  });
  return response.data;
};

export const replyToInquiry = async (inquiryId, reply) => {
  const response = await apiClient.patch(`/inquiries/${inquiryId}/reply`, {
    reply,
  });
  return response.data;
};
