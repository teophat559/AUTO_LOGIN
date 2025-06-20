import React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationContainer = styled.div<{ isRead: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${({ isRead }) => (isRead ? '#f8f9fa' : '#ffffff')};
  border: 1px solid #e9ecef;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #212529;
`;

const NotificationTime = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const NotificationMessage = styled.p`
  margin: 0;
  color: #495057;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Notification: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  type,
  createdAt,
  isRead,
  onRead,
  onDelete,
}) => {
  return (
    <NotificationContainer isRead={isRead}>
      <NotificationHeader>
        <NotificationTitle>{title}</NotificationTitle>
        <NotificationTime>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </NotificationTime>
      </NotificationHeader>
      <NotificationMessage>{message}</NotificationMessage>
      <NotificationActions>
        {!isRead && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => onRead(id)}
          >
            Mark as Read
          </Button>
        )}
        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete(id)}
        >
          Delete
        </Button>
      </NotificationActions>
    </NotificationContainer>
  );
};

export default Notification;