import { useState, useCallback } from 'react';
import { Notification, Status } from '../types';

interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: Status, message: string, options: NotificationOptions = {}) => {
      const { duration = 3000, position = 'top-right' } = options;
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        type,
        message,
        duration,
        position,
      };

      setNotifications(prev => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      addNotification('success', message, options);
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      addNotification('error', message, options);
    },
    [addNotification]
  );

  const warning = useCallback(
    (message: string, options?: NotificationOptions) => {
      addNotification('warning', message, options);
    },
    [addNotification]
  );

  const info = useCallback(
    (message: string, options?: NotificationOptions) => {
      addNotification('info', message, options);
    },
    [addNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    success,
    error,
    warning,
    info,
    removeNotification,
    clearAll,
  };
};