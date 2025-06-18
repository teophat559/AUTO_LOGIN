import React from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Table from '../common/Table';
import Tabs from '../common/Tabs';

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
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  color: var(--text-primary);
`;

// Mock data
const recentActivities = [
  { id: 1, action: 'Login', timestamp: '2024-03-20 10:30', status: 'Success' },
  { id: 2, action: 'Profile Update', timestamp: '2024-03-19 15:45', status: 'Success' },
  { id: 3, action: 'Password Change', timestamp: '2024-03-18 09:15', status: 'Success' },
  { id: 4, action: 'Login Attempt', timestamp: '2024-03-17 14:20', status: 'Failed' },
];

const notifications = [
  { id: 1, title: 'System Update', message: 'New features available', date: '2024-03-20' },
  { id: 2, title: 'Security Alert', message: 'New login from unknown device', date: '2024-03-19' },
  { id: 3, title: 'Profile Update', message: 'Your profile was updated', date: '2024-03-18' },
];

const Dashboard: React.FC = () => {
  const activityColumns = [
    { key: 'action', title: 'Action', dataIndex: 'action' },
    { key: 'timestamp', title: 'Timestamp', dataIndex: 'timestamp' },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value: string) => (
        <span
          style={{
            color: value === 'Success' ? 'var(--success-color)' : 'var(--danger-color)',
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  const notificationColumns = [
    { key: 'title', title: 'Title', dataIndex: 'title' },
    { key: 'message', title: 'Message', dataIndex: 'message' },
    { key: 'date', title: 'Date', dataIndex: 'date' },
  ];

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      content: (
        <div>
          <StatsGrid>
            <StatCard>
              <StatValue>12</StatValue>
              <StatLabel>Total Logins</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>3</StatValue>
              <StatLabel>Profile Updates</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>5</StatValue>
              <StatLabel>Notifications</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>98%</StatValue>
              <StatLabel>Account Health</StatLabel>
            </StatCard>
          </StatsGrid>

          <Section>
            <SectionTitle>Recent Activities</SectionTitle>
            <Table
              data={recentActivities}
              dataSource={recentActivities}
              columns={activityColumns}
              emptyMessage="No recent activities"
            />
          </Section>
        </div>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      content: (
        <Section>
          <Table
            data={notifications}
            dataSource={notifications}
            columns={notificationColumns}
            emptyMessage="No notifications"
          />
        </Section>
      ),
    },
  ];

  return (
    <DashboardContainer>
      <Tabs
        tabs={tabs}
        activeTab="overview"
        onChange={() => {}}
        variant="underline"
      />
    </DashboardContainer>
  );
};

export default Dashboard;