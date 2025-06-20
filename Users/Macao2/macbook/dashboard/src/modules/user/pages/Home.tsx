import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useContests } from '../../../hooks/useContests';
import { useContestants } from '../../../hooks/useContestants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { contests } = useContests();
  const { contestants } = useContestants();

  const activeContests = contests?.filter(contest => contest.status === 'active') || [];
  const myContests = contestants?.filter(contestant =>
    activeContests.some(contest => contest.id === contestant.contestId)
  ) || [];

  return (
    <div>
      <h1>Welcome to MacBook Contest</h1>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Active Contests" extra={<Button type="primary" onClick={() => navigate('/contests')}>View All</Button>}>
            {activeContests.map(contest => (
              <Card.Grid key={contest.id} style={{ width: '100%', padding: '12px' }}>
                <h3>{contest.title}</h3>
                <p>{contest.description}</p>
                <Button type="primary" onClick={() => navigate(`/contests/${contest.id}`)}>
                  View Details
                </Button>
              </Card.Grid>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="My Contests" extra={<Button type="primary" onClick={() => navigate('/submissions')}>View All</Button>}>
            {myContests.map(contestant => {
              const contest = activeContests.find(c => c.id === contestant.contestId);
              return (
                <Card.Grid key={contestant.id} style={{ width: '100%', padding: '12px' }}>
                  <h3>{contest?.title}</h3>
                  <p>Status: {contestant.status}</p>
                  <Button type="primary" onClick={() => navigate(`/contests/${contest?.id}/submit`)}>
                    Submit Solution
                  </Button>
                </Card.Grid>
              );
            })}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;