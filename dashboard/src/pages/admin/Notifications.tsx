import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Badge } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const NotificationsContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const NotificationCard = styled(Card)<{ isRead: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: ${({ isRead }) => (isRead ? '#f5f5f5' : '#e3f2fd')};
  border-left: 4px solid ${({ isRead }) => (isRead ? '#bdbdbd' : '#0288d1')};
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #212529;
`;

const NotificationTime = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const NotificationContent = styled.p`
  margin: 0;
  color: #495057;
  line-height: 1.5;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Contest Submission',
      content: 'John Doe has submitted an entry for the Photography Contest',
      type: 'info',
      isRead: false,
      createdAt: '2024-02-20T10:30:00Z',
    },
    {
      id: '2',
      title: 'Contest Results Ready',
      content: 'The results for the Design Challenge are now available',
      type: 'success',
      isRead: false,
      createdAt: '2024-02-19T15:45:00Z',
    },
    {
      id: '3',
      title: 'System Maintenance',
      content: 'Scheduled maintenance will occur on February 25th from 2-4 AM UTC',
      type: 'warning',
      isRead: true,
      createdAt: '2024-02-18T09:00:00Z',
    },
  ]);

  const { showToast } = useToast();

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    showToast('Notification marked as read', 'success');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
    showToast('Notification deleted', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    showToast('All notifications marked as read', 'success');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <NotificationsContainer>
      <Header>
        <Title>Notifications</Title>
        {notifications.some(n => !n.isRead) && (
          <Button variant="secondary" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Header>

      {notifications.length === 0 ? (
        <EmptyState>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </EmptyState>
      ) : (
        notifications.map(notification => (
          <NotificationCard key={notification.id} isRead={notification.isRead}>
            <div style={{ fontWeight: notification.isRead ? 'normal' : 'bold', fontSize: '1.1rem' }}>{notification.title}</div>
            <div style={{ margin: '8px 0' }}>{notification.content}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {!notification.isRead && (
                <Button size="small" onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as Read
                </Button>
              )}
              <Button size="small" variant="outline" danger onClick={() => handleDelete(notification.id)}>
                Delete
              </Button>
            </div>
          </NotificationCard>
        ))
      )}
    </NotificationsContainer>
  );
};

export default Notifications;