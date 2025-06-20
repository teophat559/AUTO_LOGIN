import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Row, Col } from '../../components/common';

const HomeContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const ContestCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ContestImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
`;

const ContestContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const ContestTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
`;

const ContestDescription = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
`;

const ContestStats = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const Home: React.FC = () => {
  const contests = [
    {
      id: 1,
      title: 'Cuộc thi Hoa hậu Việt Nam 2024',
      description: 'Cuộc thi sắc đẹp lớn nhất Việt Nam',
      image: '/images/contest1.jpg',
      participants: 100,
      votes: 5000,
    },
    // Add more contests...
  ];

  return (
    <HomeContainer>
      <h1>Cuộc thi đang diễn ra</h1>
      <Row gutter={[16, 16]}>
        {contests.map((contest) => (
          <Col xs={24} sm={12} md={8} key={contest.id}>
            <ContestCard>
              <ContestImage src={contest.image} alt={contest.title} />
              <ContestContent>
                <ContestTitle>{contest.title}</ContestTitle>
                <ContestDescription>{contest.description}</ContestDescription>
                <ContestStats>
                  <span>👥 {contest.participants} thí sinh</span>
                  <span>👍 {contest.votes} lượt bình chọn</span>
                </ContestStats>
                <Button variant="primary" fullWidth>
                  Xem chi tiết
                </Button>
              </ContestContent>
            </ContestCard>
          </Col>
        ))}
      </Row>
    </HomeContainer>
  );
};

export default Home;