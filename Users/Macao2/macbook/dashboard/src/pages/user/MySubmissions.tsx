import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge, Select } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const MySubmissionsContainer = styled.div`
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

const SubmissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SubmissionCard = styled(Card)`
  padding: 1.5rem;
`;

const SubmissionImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SubmissionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  color: #212529;
  margin: 0 0 0.5rem;
`;

const ContestName = styled.p`
  color: #6c757d;
  margin: 0 0 1rem;
  font-size: 0.875rem;
`;

const SubmissionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SubmissionDate = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const SubmissionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

interface Submission {
  id: string;
  title: string;
  contestId: string;
  contestName: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  score?: number;
  feedback?: string;
}

const MySubmissions: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with API call
  const submissions: Submission[] = [
    {
      id: '1',
      title: 'Sunset at the Beach',
      contestId: '1',
      contestName: 'Summer Photography Contest',
      imageUrl: 'https://source.unsplash.com/random/800x600?sunset',
      status: 'approved',
      submittedAt: '2024-03-15T10:30:00Z',
      score: 95,
      feedback: 'Excellent composition and lighting!',
    },
    {
      id: '2',
      title: 'Digital Landscape',
      contestId: '2',
      contestName: 'Digital Art Challenge',
      imageUrl: 'https://source.unsplash.com/random/800x600?digital-art',
      status: 'pending',
      submittedAt: '2024-03-18T15:45:00Z',
    },
    {
      id: '3',
      title: 'Urban Photography',
      contestId: '1',
      contestName: 'Summer Photography Contest',
      imageUrl: 'https://source.unsplash.com/random/800x600?urban',
      status: 'rejected',
      submittedAt: '2024-03-10T09:15:00Z',
      feedback: 'Image quality does not meet contest requirements.',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'info';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = submission.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || submission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewSubmission = (id: string) => {
    navigate(`/submissions/${id}`);
  };

  const handleEditSubmission = (id: string) => {
    navigate(`/submissions/${id}/edit`);
  };

  const handleDeleteSubmission = (id: string) => {
    // Implement delete logic
    showToast('Submission deleted successfully', 'success');
  };

  return (
    <MySubmissionsContainer>
      <Header>
        <Title>My Submissions</Title>
      </Header>

      <Filters>
        <SearchBar
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />
      </Filters>

      {filteredSubmissions.length > 0 ? (
        <SubmissionGrid>
          {filteredSubmissions.map((submission) => (
            <SubmissionCard key={submission.id}>
              <SubmissionImage
                src={submission.imageUrl}
                alt={submission.title}
              />
              <SubmissionTitle>{submission.title}</SubmissionTitle>
              <ContestName>{submission.contestName}</ContestName>
              <SubmissionInfo>
                <SubmissionDate>
                  Submitted on {formatDate(submission.submittedAt)}
                </SubmissionDate>
                <Badge color={getStatusColor(submission.status)}>
                  {submission.status.charAt(0).toUpperCase() +
                    submission.status.slice(1)}
                </Badge>
              </SubmissionInfo>
              {submission.score && (
                <div>
                  Score: <strong>{submission.score}/100</strong>
                </div>
              )}
              {submission.feedback && (
                <div style={{ marginTop: '0.5rem', color: '#6c757d' }}>
                  Feedback: {submission.feedback}
                </div>
              )}
              <SubmissionActions>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleViewSubmission(submission.id)}
                >
                  View
                </Button>
                {submission.status === 'pending' && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleEditSubmission(submission.id)}
                  >
                    Edit
                  </Button>
                )}
                {submission.status === 'pending' && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteSubmission(submission.id)}
                  >
                    Delete
                  </Button>
                )}
              </SubmissionActions>
            </SubmissionCard>
          ))}
        </SubmissionGrid>
      ) : (
        <EmptyState>
          <h3>No submissions found</h3>
          <p>Try adjusting your search or filters</p>
        </EmptyState>
      )}
    </MySubmissionsContainer>
  );
};

export default MySubmissions;