import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge, Select } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const ContestListContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchBar = styled(Input)`
  flex: 1;
`;

const ContestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ContestCard = styled(Card)`
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ContestImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ContestTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  color: #212529;
  margin: 0 0 0.5rem;
`;

const ContestDescription = styled.p`
  color: #6c757d;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContestInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ContestType = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const ContestParticipants = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const ContestDates = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const ContestDate = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateLabel = styled.span`
  font-size: 0.75rem;
  color: #adb5bd;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

interface Contest {
  id: string;
  title: string;
  description: string;
  type: string;
  status: 'upcoming' | 'active' | 'ended';
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  imageUrl: string;
}

const ContestList: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data - replace with API call
  const contests: Contest[] = [
    {
      id: '1',
      title: 'Summer Photography Contest',
      description:
        'Capture the beauty of summer in this exciting photography contest. Share your best summer moments and win amazing prizes!',
      type: 'Photography',
      status: 'upcoming',
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-08-31T23:59:59Z',
      maxParticipants: 100,
      currentParticipants: 45,
      imageUrl: 'https://source.unsplash.com/random/800x600?summer',
    },
    {
      id: '2',
      title: 'Digital Art Challenge',
      description:
        'Showcase your digital art skills in this month-long challenge. Create stunning digital artwork and compete for cash prizes.',
      type: 'Digital Art',
      status: 'active',
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-03-31T23:59:59Z',
      maxParticipants: 50,
      currentParticipants: 32,
      imageUrl: 'https://source.unsplash.com/random/800x600?digital-art',
    },
    {
      id: '3',
      title: 'Short Film Festival',
      description:
        'Submit your short films and get a chance to be featured in our annual film festival. Open to all genres and styles.',
      type: 'Film',
      status: 'ended',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-02-28T23:59:59Z',
      maxParticipants: 30,
      currentParticipants: 30,
      imageUrl: 'https://source.unsplash.com/random/800x600?film',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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

  const filteredContests = contests.filter((contest) => {
    const matchesSearch = contest.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || contest.status === statusFilter;
    const matchesType = typeFilter === 'all' || contest.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleContestClick = (id: string) => {
    navigate(`/contests/${id}`);
  };

  return (
    <ContestListContainer>
      <Header>
        <Title>Contests</Title>
      </Header>

      <Filters>
        <SearchBar
          placeholder="Search contests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'active', label: 'Active' },
            { value: 'ended', label: 'Ended' },
          ]}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'Photography', label: 'Photography' },
            { value: 'Digital Art', label: 'Digital Art' },
            { value: 'Film', label: 'Film' },
          ]}
        />
      </Filters>

      {filteredContests.length > 0 ? (
        <ContestGrid>
          {filteredContests.map((contest) => (
            <ContestCard
              key={contest.id}
              onClick={() => handleContestClick(contest.id)}
            >
              <ContestImage src={contest.imageUrl} alt={contest.title} />
              <ContestTitle>{contest.title}</ContestTitle>
              <ContestDescription>{contest.description}</ContestDescription>
              <ContestInfo>
                <ContestType>{contest.type}</ContestType>
                <Badge color={getStatusColor(contest.status)}>
                  {contest.status.charAt(0).toUpperCase() +
                    contest.status.slice(1)}
                </Badge>
              </ContestInfo>
              <ContestDates>
                <ContestDate>
                  <DateLabel>Starts</DateLabel>
                  {formatDate(contest.startDate)}
                </ContestDate>
                <ContestDate>
                  <DateLabel>Ends</DateLabel>
                  {formatDate(contest.endDate)}
                </ContestDate>
              </ContestDates>
              <ContestParticipants>
                {contest.currentParticipants}/{contest.maxParticipants} participants
              </ContestParticipants>
            </ContestCard>
          ))}
        </ContestGrid>
      ) : (
        <EmptyState>
          <h3>No contests found</h3>
          <p>Try adjusting your search or filters</p>
        </EmptyState>
      )}
    </ContestListContainer>
  );
};

export default ContestList;