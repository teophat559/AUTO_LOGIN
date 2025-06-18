import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/common';

const StatisticsContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
`;

const StatTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: #212529;
`;

const ChartContainer = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #212529;
`;

const SimpleBarChart = styled.div`
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 200px;
  padding: 1rem 0;
`;

const Bar = styled.div<{ height: number; color: string }>`
  flex: 1;
  background: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-width: 40px;
`;

const BarLabel = styled.div`
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: #6c757d;
`;

const BarValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  font-weight: 500;
  color: #212529;
`;

const PieChart = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  position: relative;
`;

const PieSegment = styled.div<{ percentage: number; color: string; startAngle: number }>`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.color} 0deg ${props => props.startAngle}deg,
    transparent ${props => props.startAngle}deg ${props => props.startAngle + (props.percentage * 3.6)}deg,
    #f8f9fa ${props => props.startAngle + (props.percentage * 3.6)}deg 360deg
  );
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
  border-radius: 2px;
`;

const Statistics: React.FC = () => {
  // Sample data for charts
  const contestParticipationData = [
    { name: 'Jan', participants: 65 },
    { name: 'Feb', participants: 59 },
    { name: 'Mar', participants: 80 },
    { name: 'Apr', participants: 81 },
    { name: 'May', participants: 56 },
    { name: 'Jun', participants: 55 },
  ];

  const contestTypeData = [
    { name: 'Photo', value: 400, color: '#0088FE' },
    { name: 'Video', value: 300, color: '#00C49F' },
    { name: 'Writing', value: 200, color: '#FFBB28' },
    { name: 'Art', value: 100, color: '#FF8042' },
  ];

  const maxParticipants = Math.max(...contestParticipationData.map(d => d.participants));

  return (
    <StatisticsContainer>
      <Header>
        <Title>Statistics</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <h2>1,234</h2>
          <p>+12% from last month</p>
        </StatCard>
        <StatCard>
          <StatTitle>Active Contests</StatTitle>
          <h2>15</h2>
          <p>3 new this week</p>
        </StatCard>
        <StatCard>
          <StatTitle>Total Submissions</StatTitle>
          <h2>456</h2>
          <p>+8% from last week</p>
        </StatCard>
        <StatCard>
          <StatTitle>Average Score</StatTitle>
          <h2>78.5</h2>
          <p>+2.3% from last month</p>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartTitle>Contest Participation Over Time</ChartTitle>
        <SimpleBarChart>
          {contestParticipationData.map((item, index) => (
            <Bar
              key={index}
              height={(item.participants / maxParticipants) * 100}
              color="#0d6efd"
            >
              <BarValue>{item.participants}</BarValue>
              <BarLabel>{item.name}</BarLabel>
            </Bar>
          ))}
        </SimpleBarChart>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Contest Types Distribution</ChartTitle>
        <PieChart>
          {contestTypeData.map((item, index) => {
            const total = contestTypeData.reduce((sum, d) => sum + d.value, 0);
            const percentage = (item.value / total) * 100;
            const startAngle = contestTypeData
              .slice(0, index)
              .reduce((sum, d) => sum + (d.value / total) * 360, 0);

            return (
              <PieSegment
                key={index}
                percentage={percentage}
                color={item.color}
                startAngle={startAngle}
              />
            );
          })}
        </PieChart>
        <Legend>
          {contestTypeData.map((item, index) => (
            <LegendItem key={index}>
              <LegendColor color={item.color} />
              <span>{item.name}</span>
            </LegendItem>
          ))}
        </Legend>
      </ChartContainer>
    </StatisticsContainer>
  );
};

export default Statistics;