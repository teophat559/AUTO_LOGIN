import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Tabs, Button, Badge } from '../../components/common';

const NotificationsContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const NotificationCard = styled(Card)<{ read: boolean }>`
  margin-bottom: ${theme.spacing.md};
  background: ${props => props.read ? theme.colors.background.default : theme.colors.background.hover};
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const NotificationTitle = styled.h3`
  margin: 0;
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
`;

const NotificationTime = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const NotificationContent = styled.p`
  margin: 0;
  color: ${theme.colors.text.secondary};
`;

const NotificationActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Cuộc thi mới',
      content: 'Cuộc thi Hoa hậu Việt Nam 2024 đã được tạo',
      time: '2 giờ trước',
      type: 'contest',
      read: false,
    },
    {
      id: 2,
      title: 'Bình chọn thành công',
      content: 'Bạn đã bình chọn cho thí sinh Nguyễn Thị A',
      time: '1 ngày trước',
      type: 'vote',
      read: true,
    },
    // Add more notifications...
  ]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleDelete = (id: number) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  return (
    <NotificationsContainer>
      <h1>Thông báo</h1>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'all',
            label: 'Tất cả',
            children: null,
          },
          {
            key: 'unread',
            label: (
              <span>
                Chưa đọc
                <Badge count={notifications.filter(n => !n.read).length} />
              </span>
            ),
            children: null,
          },
          {
            key: 'contest',
            label: 'Cuộc thi',
            children: null,
          },
          {
            key: 'vote',
            label: 'Bình chọn',
            children: null,
          },
        ]}
      />

      {activeTab === 'unread' && (
        <Button
          variant="text"
          onClick={handleMarkAllAsRead}
          style={{ marginBottom: theme.spacing.md }}
        >
          Đánh dấu tất cả đã đọc
        </Button>
      )}

      {filteredNotifications.map(notification => (
        <NotificationCard key={notification.id} read={notification.read}>
          <NotificationHeader>
            <NotificationTitle>{notification.title}</NotificationTitle>
            <NotificationTime>{notification.time}</NotificationTime>
          </NotificationHeader>
          <NotificationContent>{notification.content}</NotificationContent>
          <NotificationActions>
            {!notification.read && (
              <Button
                variant="text"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Đánh dấu đã đọc
              </Button>
            )}
            <Button
              variant="text"
              color="error"
              onClick={() => handleDelete(notification.id)}
            >
              Xóa
            </Button>
          </NotificationActions>
        </NotificationCard>
      ))}
    </NotificationsContainer>
  );
};

export default Notifications;