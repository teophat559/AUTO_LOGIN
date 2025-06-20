import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/common';
import {
  PeopleAlt as PeopleIcon,
  EmojiEvents as ContestIcon,
  Assessment as StatsIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: 1.5rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background-color: ${({ color }) => color};
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const StatLabel = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 0.875rem;
`;

const RecentActivity = styled(Card)`
  margin-bottom: 2rem;
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ActivityTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #212529;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background-color: #e9ecef;
  color: #495057;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  margin: 0;
  color: #212529;
  font-size: 0.875rem;
`;

const ActivityTime = styled.span`
  color: #6c757d;
  font-size: 0.75rem;
`;

const Dashboard: React.FC = () => {
  const stats = [
    {
      icon: <PeopleIcon />,
      color: '#0d6efd',
      value: '1,234',
      label: 'Total Users',
    },
    {
      icon: <ContestIcon />,
      color: '#198754',
      value: '56',
      label: 'Active Contests',
    },
    {
      icon: <StatsIcon />,
      color: '#dc3545',
      value: '89%',
      label: 'Engagement Rate',
    },
    {
      icon: <NotificationIcon />,
      color: '#ffc107',
      value: '45',
      label: 'New Notifications',
    },
  ];

  const recentActivities = [
    {
      icon: <PeopleIcon />,
      text: 'New user registration: John Doe',
      time: '5 minutes ago',
    },
    {
      icon: <ContestIcon />,
      text: 'New contest created: Photography Competition',
      time: '1 hour ago',
    },
    {
      icon: <NotificationIcon />,
      text: 'System notification: Server maintenance scheduled',
      time: '2 hours ago',
    },
  ];

  return (
    <DashboardContainer>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatIcon color={stat.color}>{stat.icon}</StatIcon>
            <StatContent>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      <RecentActivity>
        <ActivityHeader>
          <ActivityTitle>Recent Activity</ActivityTitle>
        </ActivityHeader>
        <ActivityList>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon>{activity.icon}</ActivityIcon>
              <ActivityContent>
                <ActivityText>{activity.text}</ActivityText>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;