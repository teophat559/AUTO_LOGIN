import React from 'react';
import { Card } from '../../../components/common';
import styled from 'styled-components';

const NotificationCard = styled(Card)<{ read: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: ${({ read }) => (read ? '#f5f5f5' : '#e3f2fd')};
  border-left: 4px solid ${({ read }) => (read ? '#bdbdbd' : '#0288d1')};
`;

const Notifications: React.FC = () => <div>Notifications Page</div>;
export default Notifications;