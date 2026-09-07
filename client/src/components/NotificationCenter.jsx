import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Check, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getMyNotifications,
  markNotificationRead,
  markAllRead,
  streamNotifications,
} from '../api/notificationApi';
import { useNotificationStore } from '../store/notificationStore';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const NotificationCenter = () => {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    markRead,
    markAllRead: markAllStoreRead,
  } = useNotificationStore();

  const loadNotifications = useCallback(async (isUnread) => {
    setIsLoading(true);
    try {
      const response = await getMyNotifications(1, 50, isUnread);
      setNotifications(
        response.data?.notifications || [],
        response.data?.unreadCount || 0
      );
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [setNotifications]);

  useEffect(() => {
    loadNotifications(unreadOnly);
  }, [unreadOnly, loadNotifications]);

  // Connect to SSE stream
  useEffect(() => {
    let source = null;
    try {
      source = new EventSource(streamNotifications(), { withCredentials: true });
      source.onmessage = (event) => {
        try {
          const item = JSON.parse(event.data);
          addNotification(item);
          toast((t) => (
            <div className="text-xs">
              <p style={{ color: 'var(--color-text)' }} className="font-bold">{item.title}</p>
              <p style={{ color: 'var(--color-text-muted)' }}>{item.message}</p>
            </div>
          ));
        } catch (e) {
          // ignore non-JSON heartbeat
        }
      };
    } catch (err) {
      console.error('SSE connection error:', err);
    }

    return () => {
      if (source) source.close();
    };
  }, [addNotification]);

  const handleMarkOneRead = async (id) => {
    try {
      await markNotificationRead(id);
      markRead(id);
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      markAllStoreRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications read');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div
        style={{ borderColor: 'var(--color-border)' }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
      >
        <div className="page-header-accent">
          <h2 style={{ color: 'var(--color-text)' }} className="text-xl font-bold">
            System Notifications
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
            Real-time updates regarding schedules, registrations, inquiries, and events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            className="flex items-center p-1 rounded-lg border"
          >
            <button
              type="button"
              onClick={() => setUnreadOnly(false)}
              style={{
                background: !unreadOnly ? 'var(--color-primary)' : 'transparent',
                color: !unreadOnly ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
              className="px-3 py-1 text-xs rounded-md font-semibold transition-colors"
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setUnreadOnly(true)}
              style={{
                background: unreadOnly ? 'var(--color-primary)' : 'transparent',
                color: unreadOnly ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
              className="px-3 py-1 text-xs rounded-md font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: 'var(--color-accent)',
                    color: '#0B0E14',
                  }}
                  className="px-1.5 py-0.2 rounded-full font-bold text-[10px]"
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              style={{
                background: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors hover:bg-[var(--color-border)]"
            >
              <CheckCheck className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <LoadingSpinner size="lg" />
          <p style={{ color: 'var(--color-text-muted)' }} className="mt-3 text-xs">
            Loading notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          message={unreadOnly ? 'No unread notifications found.' : 'You have no alerts at this time.'}
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => {
            const isUnread = !notif.readAt;
            return (
              <div
                key={notif._id}
                style={{
                  background: isUnread ? 'var(--color-surface)' : 'var(--color-surface-alt)',
                  borderColor: isUnread ? 'var(--color-primary)' : 'var(--color-border)',
                  borderLeftWidth: isUnread ? '3px' : '1px',
                  borderLeftColor: isUnread ? 'var(--color-primary)' : 'var(--color-border)',
                }}
                className="p-4 rounded-[10px] border transition-all flex items-start justify-between gap-3 card-lift"
              >
                <div className="flex items-start gap-3">
                  <div
                    style={{
                      backgroundColor: isUnread ? 'var(--color-accent)' : 'transparent',
                    }}
                    className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                  />
                  <div className="space-y-1">
                    <h4
                      style={{ color: 'var(--color-text)' }}
                      className="text-xs font-bold"
                    >
                      {notif.title}
                    </h4>
                    <p
                      style={{ color: 'var(--color-text-muted)' }}
                      className="text-xs leading-relaxed"
                    >
                      {notif.message}
                    </p>
                    <div
                      style={{ color: 'var(--color-text-dim)' }}
                      className="flex items-center gap-1 text-[10px] pt-1"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}</span>
                    </div>
                  </div>
                </div>

                {isUnread && (
                  <button
                    type="button"
                    onClick={() => handleMarkOneRead(notif._id)}
                    style={{
                      color: 'var(--color-text-muted)',
                      background: 'var(--color-surface)',
                    }}
                    className="p-1.5 rounded-md hover:text-white transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
