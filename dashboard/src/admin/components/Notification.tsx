import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Card } from '../../components/common';

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

const NotificationCard = styled(Card)<{ read: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: ${({ read }) => (read ? '#f5f5f5' : '#e3f2fd')};
  border-left: 4px solid ${({ read }) => (read ? '#bdbdbd' : '#0288d1')};
`;

const mockNotifications = [
  { id: '1', title: 'Hệ thống cập nhật', content: 'Chức năng mới đã được thêm vào.', read: false },
  { id: '2', title: 'Cảnh báo bảo mật', content: 'Vui lòng đổi mật khẩu.', read: false },
  { id: '3', title: 'Thông báo chung', content: 'Chào mừng bạn đến với hệ thống.', read: true },
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
          <NotificationCard key={n.id} read={n.read}>
            <div style={{ fontWeight: n.read ? 'normal' : 'bold', fontSize: '1.1rem' }}>{n.title}</div>
            <div style={{ margin: '8px 0' }}>{n.content}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {!n.read && (
                <Button size="small" onClick={() => markAsRead(n.id)}>
                  Đánh dấu đã đọc
                </Button>
              )}
              <Button size="small" variant="outline" danger onClick={() => deleteNotification(n.id)}>
                Xóa
              </Button>
            </div>
          </NotificationCard>
        ))}
        {notifications.length === 0 && <div>Không có thông báo nào.</div>}
      </NotificationList>
    </Container>
  );
};

export default Notification;