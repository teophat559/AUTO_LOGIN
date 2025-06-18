import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../../components/common';
import { Button } from '../../components/common';

const NotificationCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #e3f2fd;
  border-left: 4px solid #0288d1;
`;

const Container = styled.div`
  padding: 32px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #0288d1;
  margin-bottom: 24px;
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NotificationTitle = styled.h2`
  font-size: 1.2rem;
  color: #0288d1;
  margin-bottom: 16px;
`;

const NotificationContent = styled.p`
  margin-bottom: 16px;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
`;

const mockNotifications = [
  { id: '1', title: 'Bạn có bình chọn mới', content: 'Cảm ơn bạn đã bình chọn!', read: false },
  { id: '2', title: 'Cập nhật tài khoản', content: 'Thông tin tài khoản đã được cập nhật.', read: false },
  { id: '3', title: 'Chào mừng', content: 'Chào mừng bạn đến với hệ thống.', read: true },
];

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Container>
      <Title>Thông báo</Title>
      <NotificationList>
        {notifications.map(n => (
          <NotificationCard key={n.id}>
            <NotificationTitle>{n.title}</NotificationTitle>
            <NotificationContent>{n.content}</NotificationContent>
            <NotificationActions>
              {!n.read && (
                <Button size="small" variant="secondary" onClick={() => markAsRead(n.id)}>
                  Mark as Read
                </Button>
              )}
              <Button size="small" variant="error" onClick={() => deleteNotification(n.id)}>
                Delete
              </Button>
            </NotificationActions>
          </NotificationCard>
        ))}
        {notifications.length === 0 && <div>Không có thông báo nào.</div>}
      </NotificationList>
    </Container>
  );
};

export default Notification;