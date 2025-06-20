import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Badge } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const HomeContainer = styled.div`
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

const WelcomeMessage = styled.p`
  margin: 0.5rem 0 0 0;
  color: #6c757d;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(Card)`
  padding: 1.5rem;
`;

const StatTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #6c757d;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #212529;
`;

const ContestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ContestCard = styled(Card)`
  padding: 1.5rem;
`;

const ContestTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #212529;
`;

const ContestDescription = styled.p`
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ContestMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

const ContestStats = styled.div`
  display: flex;
  gap: 1rem;
  color: #6c757d;
  font-size: 0.875rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

interface Contest {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'active' | 'ended';
  startDate: string;
  endDate: string;
  participants: number;
  submissions: number;
}

const Home: React.FC = () => {
  const { showToast } = useToast();
  const [stats] = useState({
    activeContests: 3,
    totalSubmissions: 12,
    upcomingContests: 2,
    completedContests: 5,
  });

  const [contests] = useState<Contest[]>([
    {
      id: '1',
      title: 'Photography Contest 2024',
      description:
        'Showcase your photography skills in our annual contest. Submit your best shots and win amazing prizes!',
      status: 'active',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-03-01T00:00:00Z',
      participants: 150,
      submissions: 450,
    },
    {
      id: '2',
      title: 'Design Challenge',
      description:
        'Create innovative designs for our upcoming product launch. Let your creativity shine!',
      status: 'upcoming',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-04-01T00:00:00Z',
      participants: 0,
      submissions: 0,
    },
    {
      id: '3',
      title: 'Coding Competition',
      description:
        'Put your programming skills to the test in this exciting coding challenge.',
      status: 'ended',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-02-01T00:00:00Z',
      participants: 200,
      submissions: 600,
    },
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'ended':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <HomeContainer>
      <Header>
        <Title>Welcome back, John!</Title>
        <WelcomeMessage>
          Here's what's happening with your contests today.
        </WelcomeMessage>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatTitle>Active Contests</StatTitle>
          <StatValue>{stats.activeContests}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Submissions</StatTitle>
          <StatValue>{stats.totalSubmissions}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Upcoming Contests</StatTitle>
          <StatValue>{stats.upcomingContests}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Completed Contests</StatTitle>
          <StatValue>{stats.completedContests}</StatValue>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Active Contests</SectionTitle>
          <Button variant="secondary">View All</Button>
        </SectionHeader>
        <ContestGrid>
          {contests
            .filter(contest => contest.status === 'active')
            .map(contest => (
              <ContestCard key={contest.id}>
                <ContestTitle>{contest.title}</ContestTitle>
                <ContestDescription>{contest.description}</ContestDescription>
                <Badge variant={getStatusColor(contest.status)}>
                  {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                </Badge>
                <ContestMeta>
                  <ContestStats>
                    <Stat>
                      <span>👥</span> {contest.participants} participants
                    </Stat>
                    <Stat>
                      <span>📝</span> {contest.submissions} submissions
                    </Stat>
                  </ContestStats>
                  <Button variant="primary">View Details</Button>
                </ContestMeta>
              </ContestCard>
            ))}
        </ContestGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Upcoming Contests</SectionTitle>
          <Button variant="secondary">View All</Button>
        </SectionHeader>
        <ContestGrid>
          {contests
            .filter(contest => contest.status === 'upcoming')
            .map(contest => (
              <ContestCard key={contest.id}>
                <ContestTitle>{contest.title}</ContestTitle>
                <ContestDescription>{contest.description}</ContestDescription>
                <Badge variant={getStatusColor(contest.status)}>
                  {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                </Badge>
                <ContestMeta>
                  <ContestStats>
                    <Stat>
                      <span>📅</span> Starts {formatDate(contest.startDate)}
                    </Stat>
                  </ContestStats>
                  <Button variant="primary">Register</Button>
                </ContestMeta>
              </ContestCard>
            ))}
        </ContestGrid>
      </Section>
    </HomeContainer>
  );
};

export default Home;