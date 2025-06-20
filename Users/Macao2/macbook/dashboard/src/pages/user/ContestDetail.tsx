import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Tabs } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const ContestDetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
`;

const Description = styled.p`
  color: #6c757d;
  margin: 0.5rem 0 0;
`;

const ContestInfo = styled(Card)`
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #212529;
  font-weight: 500;
`;

const RulesSection = styled(Card)`
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  color: #212529;
  margin: 0 0 1rem;
`;

const RulesList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #495057;
`;

const RuleItem = styled.li`
  margin-bottom: 0.5rem;
`;

const PrizesSection = styled(Card)`
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

const PrizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const PrizeCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
  background-color: #f8f9fa;
`;

const PrizeRank = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const PrizeAmount = styled.div`
  font-size: 1.25rem;
  color: #0d6efd;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const PrizeDescription = styled.p`
  color: #6c757d;
  margin: 0;
`;

const SubmissionsSection = styled(Card)`
  padding: 1.5rem;
`;

const SubmissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SubmissionCard = styled(Card)`
  padding: 1rem;
`;

const SubmissionImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SubmissionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: #212529;
  margin: 0 0 0.5rem;
`;

const SubmissionAuthor = styled.p`
  color: #6c757d;
  margin: 0;
  font-size: 0.875rem;
`;

const ActionButton = styled(Button)`
  margin-top: 1rem;
`;

interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  type: string;
  rules: string[];
  prizes: {
    rank: string;
    amount: string;
    description: string;
  }[];
  maxParticipants: number;
  currentParticipants: number;
  submissions: {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
  }[];
}

const ContestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API call
  const contest: Contest = {
    id: id || '1',
    title: 'Summer Photography Contest',
    description:
      'Capture the beauty of summer in this exciting photography contest. Share your best summer moments and win amazing prizes!',
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-08-31T23:59:59Z',
    status: 'upcoming',
    type: 'Photography',
    rules: [
      'All submissions must be original work',
      'Maximum 3 entries per participant',
      'Photos must be taken during summer 2024',
      'Minimum resolution: 3000x2000 pixels',
      'No watermarks or signatures allowed',
    ],
    prizes: [
      {
        rank: '1st Place',
        amount: '$1,000',
        description: 'Cash prize and featured on our website',
      },
      {
        rank: '2nd Place',
        amount: '$500',
        description: 'Cash prize and honorable mention',
      },
      {
        rank: '3rd Place',
        amount: '$250',
        description: 'Cash prize',
      },
    ],
    maxParticipants: 100,
    currentParticipants: 45,
    submissions: [
      {
        id: '1',
        title: 'Sunset at the Beach',
        author: 'John Doe',
        imageUrl: 'https://source.unsplash.com/random/800x600?sunset',
      },
      {
        id: '2',
        title: 'Summer Flowers',
        author: 'Jane Smith',
        imageUrl: 'https://source.unsplash.com/random/800x600?flowers',
      },
      {
        id: '3',
        title: 'Beach Day',
        author: 'Mike Johnson',
        imageUrl: 'https://source.unsplash.com/random/800x600?beach',
      },
    ],
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
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

  const handleSubmit = () => {
    navigate(`/contests/${id}/submit`);
  };

  return (
    <ContestDetailContainer>
      <Header>
        <Title>{contest.title}</Title>
        <Description>{contest.description}</Description>
      </Header>

      <ContestInfo>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <Badge color={getStatusColor(contest.status)}>
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </Badge>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Type</InfoLabel>
            <InfoValue>{contest.type}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Start Date</InfoLabel>
            <InfoValue>{formatDate(contest.startDate)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>End Date</InfoLabel>
            <InfoValue>{formatDate(contest.endDate)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Participants</InfoLabel>
            <InfoValue>
              {contest.currentParticipants}/{contest.maxParticipants}
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </ContestInfo>

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'rules', label: 'Rules' },
          { value: 'prizes', label: 'Prizes' },
          { value: 'submissions', label: 'Submissions' },
        ]}
      />

      {activeTab === 'overview' && (
        <>
          <RulesSection>
            <SectionTitle>Rules</SectionTitle>
            <RulesList>
              {contest.rules.map((rule, index) => (
                <RuleItem key={index}>{rule}</RuleItem>
              ))}
            </RulesList>
          </RulesSection>

          <PrizesSection>
            <SectionTitle>Prizes</SectionTitle>
            <PrizeGrid>
              {contest.prizes.map((prize, index) => (
                <PrizeCard key={index}>
                  <PrizeRank>{prize.rank}</PrizeRank>
                  <PrizeAmount>{prize.amount}</PrizeAmount>
                  <PrizeDescription>{prize.description}</PrizeDescription>
                </PrizeCard>
              ))}
            </PrizeGrid>
          </PrizesSection>
        </>
      )}

      {activeTab === 'rules' && (
        <RulesSection>
          <SectionTitle>Contest Rules</SectionTitle>
          <RulesList>
            {contest.rules.map((rule, index) => (
              <RuleItem key={index}>{rule}</RuleItem>
            ))}
          </RulesList>
        </RulesSection>
      )}

      {activeTab === 'prizes' && (
        <PrizesSection>
          <SectionTitle>Prize Pool</SectionTitle>
          <PrizeGrid>
            {contest.prizes.map((prize, index) => (
              <PrizeCard key={index}>
                <PrizeRank>{prize.rank}</PrizeRank>
                <PrizeAmount>{prize.amount}</PrizeAmount>
                <PrizeDescription>{prize.description}</PrizeDescription>
              </PrizeCard>
            ))}
          </PrizeGrid>
        </PrizesSection>
      )}

      {activeTab === 'submissions' && (
        <SubmissionsSection>
          <SectionTitle>Recent Submissions</SectionTitle>
          <SubmissionGrid>
            {contest.submissions.map((submission) => (
              <SubmissionCard key={submission.id}>
                <SubmissionImage
                  src={submission.imageUrl}
                  alt={submission.title}
                />
                <SubmissionTitle>{submission.title}</SubmissionTitle>
                <SubmissionAuthor>by {submission.author}</SubmissionAuthor>
              </SubmissionCard>
            ))}
          </SubmissionGrid>
        </SubmissionsSection>
      )}

      {contest.status === 'active' && (
        <ActionButton variant="primary" onClick={handleSubmit}>
          Submit Entry
        </ActionButton>
      )}
    </ContestDetailContainer>
  );
};

export default ContestDetail;
