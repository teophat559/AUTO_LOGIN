import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, Table } from '../../components/common';
import { theme } from '../../styles/theme';

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled(Card)`
  padding: ${theme.spacing.lg};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.md};

  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.white};
  }
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all ${theme.transitions.default};

  ${props => {
    switch (props.status.toLowerCase()) {
      case 'success':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
          border: 1px solid ${theme.colors.success}40;
        `;
      case 'failed':
      case 'error':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
          border: 1px solid ${theme.colors.error}40;
        `;
      case 'pending':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
          border: 1px solid ${theme.colors.warning}40;
        `;
      default:
        return `
          background-color: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.text.secondary}40;
        `;
    }
  }}
`;

// Mock data
const stats = [
  {
    label: 'Total Users',
    value: '1,234',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: theme.colors.primary,
  },
  {
    label: 'Active Contests',
    value: '12',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: theme.colors.success,
  },
  {
    label: 'Total Contestants',
    value: '567',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: theme.colors.info,
  },
  {
    label: 'Total Votes',
    value: '8,901',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: theme.colors.warning,
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'Created new contest',
    timestamp: '2024-03-20 10:30',
    status: 'Success',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'Updated contest settings',
    timestamp: '2024-03-20 09:15',
    status: 'Success',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'Deleted contest',
    timestamp: '2024-03-19 16:45',
    status: 'Success',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    action: 'Added new contestant',
    timestamp: '2024-03-19 14:20',
    status: 'Failed',
  },
];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const columns = [
    { key: 'user', title: t('admin.activity.user'), dataIndex: 'user' },
    { key: 'action', title: t('admin.activity.action'), dataIndex: 'action' },
    { key: 'timestamp', title: t('admin.activity.timestamp'), dataIndex: 'timestamp' },
    {
      key: 'status',
      title: t('admin.activity.status'),
      dataIndex: 'status',
      render: (value: string) => <StatusBadge status={value}>{value}</StatusBadge>,
    },
  ];

  return (
    <DashboardContainer>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatIcon color={stat.color}>{stat.icon}</StatIcon>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{t(`admin.stats.${stat.label.toLowerCase().replace(' ', '_')}`)}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <Section>
        <SectionTitle>{t('admin.recent_activities')}</SectionTitle>
        <Card>
          <Table
            dataSource={recentActivities}
            columns={columns}
            emptyMessage={t('admin.no_activities')}
          />
        </Card>
      </Section>
    </DashboardContainer>
  );
};

export default Dashboard;