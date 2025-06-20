import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/common';
import { theme } from '../../styles/theme';

const StatisticsContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const ChartCard = styled(Card)`
  padding: ${theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.lg};
`;

const MetricCard = styled(Card)`
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};

  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.white};
  }
`;

// Mock data
const metrics = [
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

const Statistics: React.FC = () => {
  const { t } = useLanguage();

  return (
    <StatisticsContainer>
      <Grid>
        {metrics.map((metric, index) => (
          <MetricCard key={index}>
            <MetricIcon color={metric.color}>{metric.icon}</MetricIcon>
            <MetricValue>{metric.value}</MetricValue>
            <MetricLabel>{t(`admin.stats.${metric.label.toLowerCase().replace(' ', '_')}`)}</MetricLabel>
          </MetricCard>
        ))}
      </Grid>

      <Grid>
        <ChartCard>
          <ChartTitle>{t('admin.stats.user_growth')}</ChartTitle>
          {/* Add user growth chart component here */}
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('admin.stats.contest_participation')}</ChartTitle>
          {/* Add contest participation chart component here */}
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('admin.stats.voting_trends')}</ChartTitle>
          {/* Add voting trends chart component here */}
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('admin.stats.contest_status')}</ChartTitle>
          {/* Add contest status chart component here */}
        </ChartCard>
      </Grid>
    </StatisticsContainer>
  );
};

export default Statistics;