import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Badge } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const NotificationsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationCard = styled(Card)<{ read: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: ${({ read }) => (read ? '#f5f5f5' : '#e3f2fd')};
  border-left: 4px solid ${({ read }) => (read ? '#bdbdbd' : '#0288d1')};
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #212529;
  margin-bottom: 0.25rem;
`;

const NotificationMessage = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const NotificationTime = styled.div`
  font-size: 0.8rem;
  color: #adb5bd;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

interface Notification {
  id: string;
  type: 'contest' | 'submission' | 'system' | 'achievement';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
}

const Notifications: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'contest',
      title: 'New Contest Available',
      message: 'Summer Photography Contest is now open for submissions.',
      time: '2024-03-20T10:30:00Z',
      isRead: false,
      link: '/contests/1',
    },
    {
      id: '2',
      type: 'submission',
      title: 'Submission Approved',
      message: 'Your submission for Digital Art Challenge has been approved.',
      time: '2024-03-19T15:45:00Z',
      isRead: true,
      link: '/submissions/1',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'New Achievement Unlocked',
      message: 'Congratulations! You have earned the "Early Bird" badge.',
      time: '2024-03-18T09:15:00Z',
      isRead: false,
    },
    {
      id: '4',
      type: 'system',
      title: 'System Maintenance',
      message: 'The platform will be under maintenance on March 25th.',
      time: '2024-03-17T14:20:00Z',
      isRead: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contest':
        return '🎯';
      case 'submission':
        return '📝';
      case 'achievement':
        return '🏆';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    showToast('Marked as read', 'success');
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
    showToast('Notification deleted', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    showToast('All notifications marked as read', 'success');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationsContainer>
      <Header>
        <Title>Notifications</Title>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </Header>

      {notifications.length > 0 ? (
        <NotificationList>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} read={notification.isRead}>
              <NotificationIcon>
                {getNotificationIcon(notification.type)}
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>{formatTime(notification.time)}</NotificationTime>
              </NotificationContent>
              <NotificationActions>
                {!notification.isRead && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
                <Button
                  variant="error"
                  size="small"
                  onClick={() => handleDelete(notification.id)}
                >
                  Delete
                </Button>
              </NotificationActions>
            </NotificationCard>
          ))}
        </NotificationList>
      ) : (
        <EmptyState>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </EmptyState>
      )}
    </NotificationsContainer>
  );
};

export default Notifications;