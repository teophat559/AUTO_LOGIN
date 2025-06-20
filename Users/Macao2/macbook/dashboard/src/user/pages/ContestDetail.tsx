import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Button, Row, Col, Avatar, Progress, Modal, Input } from '../../components/common';

const ContestDetailContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const ContestHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const ContestImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const ContestTitle = styled.h1`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
`;

const ContestDescription = styled.p`
  margin: 0 0 ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.lg};
`;

const ContestantCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ContestantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const ContestantInfo = styled.div`
  flex: 1;
`;

const ContestantName = styled.h3`
  margin: 0 0 ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
`;

const ContestantDescription = styled.p`
  margin: 0;
  color: ${theme.colors.text.secondary};
`;

const VoteButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing.md};
`;

const ContestDetail: React.FC = () => {
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<any>(null);

  const contest = {
    id: 1,
    title: 'Cuộc thi Hoa hậu Việt Nam 2024',
    description: 'Cuộc thi sắc đẹp lớn nhất Việt Nam',
    image: '/images/contest1.jpg',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    contestants: [
      {
        id: 1,
        name: 'Nguyễn Thị A',
        avatar: '/images/contestant1.jpg',
        description: 'Thí sinh số 1',
        votes: 1000,
      },
      // Add more contestants...
    ],
  };

  const handleVote = (contestant: any) => {
    setSelectedContestant(contestant);
    setIsVoteModalOpen(true);
  };

  const handleVoteSubmit = (values: any) => {
    // Implement vote logic
    setIsVoteModalOpen(false);
  };

  return (
    <ContestDetailContainer>
      <ContestHeader>
        <ContestImage src={contest.image} alt={contest.title} />
        <ContestTitle>{contest.title}</ContestTitle>
        <ContestDescription>{contest.description}</ContestDescription>
      </ContestHeader>

      <Row gutter={[16, 16]}>
        {contest.contestants.map((contestant) => (
          <Col xs={24} sm={12} md={8} key={contestant.id}>
            <ContestantCard>
              <ContestantHeader>
                <Avatar
                  size={64}
                  src={contestant.avatar}
                  alt={contestant.name}
                />
                <ContestantInfo>
                  <ContestantName>{contestant.name}</ContestantName>
                  <ContestantDescription>
                    {contestant.description}
                  </ContestantDescription>
                </ContestantInfo>
              </ContestantHeader>
              <Progress
                percent={Math.round((contestant.votes / 1000) * 100)}
                format={(percent) => `${contestant.votes} lượt bình chọn`}
              />
              <VoteButton
                variant="primary"
                onClick={() => handleVote(contestant)}
              >
                Bình chọn
              </VoteButton>
            </ContestantCard>
          </Col>
        ))}
      </Row>

      <Modal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        title="Bình chọn thí sinh"
      >
        <form onSubmit={handleVoteSubmit}>
          <div>
            <label>Lý do bình chọn</label>
            <textarea rows={4} />
          </div>
          <button type="submit" variant="primary">
            Xác nhận bình chọn
          </button>
        </form>
      </Modal>
    </ContestDetailContainer>
  );
};

export default ContestDetail;