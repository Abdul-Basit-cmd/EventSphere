import apiClient from './axios';

export const getMyNotifications = async (page = 1, limit = 20, unreadOnly = false) => {
  let params;
  if (typeof page === 'object' && page !== null) {
    params = page;
  } else {
    params = { page, limit };
    if (unreadOnly) {
      params.unread = 'true';
    }
  }
  const response = await apiClient.get('/notifications', { params });
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllRead = async () => {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data;
};

// Aliases for backward compatibility
export const fetchNotifications = getMyNotifications;
export const markNotificationAsRead = markNotificationRead;
export const markAllNotificationsAsRead = markAllRead;

export const streamNotifications = () => {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/notifications/stream`;
};

