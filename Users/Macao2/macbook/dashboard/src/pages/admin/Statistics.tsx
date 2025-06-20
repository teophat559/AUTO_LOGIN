import React from 'react';
import styled from 'styled-components';
import { Card } from '../../components/common';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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
    { name: 'Photo', value: 400 },
    { name: 'Video', value: 300 },
    { name: 'Writing', value: 200 },
    { name: 'Art', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const userActivityData = [
    { name: 'Mon', active: 4000, new: 2400 },
    { name: 'Tue', active: 3000, new: 1398 },
    { name: 'Wed', active: 2000, new: 9800 },
    { name: 'Thu', active: 2780, new: 3908 },
    { name: 'Fri', active: 1890, new: 4800 },
    { name: 'Sat', active: 2390, new: 3800 },
    { name: 'Sun', active: 3490, new: 4300 },
  ];

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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contestParticipationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="participants" fill="#0d6efd" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Contest Types Distribution</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={contestTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {contestTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>User Activity</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="active" fill="#198754" name="Active Users" />
            <Bar dataKey="new" fill="#0dcaf0" name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </StatisticsContainer>
  );
};

export default Statistics;