import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications, unreadCount = 0) =>
    set({
      notifications,
      unreadCount,
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  markRead: (notificationId) =>
    set((state) => {
      const updatedList = state.notifications.map((item) =>
        item._id === notificationId ? { ...item, readAt: new Date().toISOString() } : item
      );
      const updatedUnread = Math.max(0, state.unreadCount - 1);
      return {
        notifications: updatedList,
        unreadCount: updatedUnread,
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        readAt: item.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    })),
}));
