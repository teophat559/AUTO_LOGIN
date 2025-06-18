import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useContests } from '../../../hooks/useContests';
import { useContestants } from '../../../hooks/useContestants';

const HomeContainer = styled.div`
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.75rem;
`;

const Col = styled.div<{ span?: number }>`
  flex: ${props => props.span ? `${props.span}00%` : '100%'};
  padding: 0 0.75rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex: ${props => props.span ? `${props.span}00%` : '100%'};
  }
`;

const Button = styled.button<{ type?: string }>`
  background: ${props => props.type === 'primary' ? '#1890ff' : 'white'};
  color: ${props => props.type === 'primary' ? 'white' : '#1890ff'};
  border: 1px solid #1890ff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: ${props => props.type === 'primary' ? '#40a9ff' : '#f0f8ff'};
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { contests } = useContests();
  const { contestants } = useContestants();

  const activeContests = contests?.filter(contest => contest.status === 'active') || [];
  const myContests = contestants?.filter(contestant =>
    activeContests.some(contest => contest.id === contestant.contestId)
  ) || [];

  return (
    <HomeContainer>
      <h1>Welcome to MacBook Contest</h1>
      <Row>
        <Col span={12}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Active Contests</h2>
              <Button type="primary" onClick={() => navigate('/contests')}>View All</Button>
            </div>
            {activeContests.map(contest => (
              <div key={contest.id} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                <h3>{contest.title}</h3>
                <p>{contest.description}</p>
                <Button type="primary" onClick={() => navigate(`/contests/${contest.id}`)}>
                  View Details
                </Button>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>My Contests</h2>
              <Button type="primary" onClick={() => navigate('/submissions')}>View All</Button>
            </div>
            {myContests.map(contestant => {
              const contest = activeContests.find(c => c.id === contestant.contestId);
              return (
                <div key={contestant.id} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                  <h3>{contest?.title}</h3>
                  <p>Status: {contestant.status}</p>
                  <Button type="primary" onClick={() => navigate(`/contests/${contest?.id}/submit`)}>
                    Submit Solution
                  </Button>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </HomeContainer>
  );
};

export default Home;