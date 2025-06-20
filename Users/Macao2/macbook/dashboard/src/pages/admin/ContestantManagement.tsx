import React, { useState } from 'react';
import styled from 'styled-components';
import { Table, Button, Input, Modal, Card } from '../../components/common';
import { useToast } from '../../hooks/useToast';

interface Contestant {
  id: string;
  name: string;
  email: string;
  contest: string;
  submission: string;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  submittedAt: string;
}

const ContestantManagementContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'approved':
        return '#198754';
      case 'pending':
        return '#ffc107';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }};
  color: white;
`;

const ContestantManagement: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      contest: 'Photography Contest 2024',
      submission: 'nature_photo.jpg',
      status: 'pending',
      submittedAt: '2024-02-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      contest: 'Video Making Challenge',
      submission: 'short_film.mp4',
      status: 'approved',
      score: 85,
      submittedAt: '2024-02-10',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const { showToast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleView = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setIsModalOpen(true);
  };

  const handleStatusChange = (contestantId: string, newStatus: 'approved' | 'rejected') => {
    setContestants(contestants.map(contestant => {
      if (contestant.id === contestantId) {
        return {
          ...contestant,
          status: newStatus,
        };
      }
      return contestant;
    }));
    showToast(`Contestant status updated to ${newStatus}`, 'success');
  };

  const handleScoreUpdate = (contestantId: string, score: number) => {
    setContestants(contestants.map(contestant => {
      if (contestant.id === contestantId) {
        return {
          ...contestant,
          score,
        };
      }
      return contestant;
    }));
    showToast('Score updated successfully', 'success');
  };

  const filteredContestants = contestants.filter(contestant =>
    contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contestant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contestant.contest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Contest', accessor: 'contest' },
    { header: 'Submission', accessor: 'submission' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (contestant: Contestant) => (
        <StatusBadge status={contestant.status}>
          {contestant.status.charAt(0).toUpperCase() + contestant.status.slice(1)}
        </StatusBadge>
      ),
    },
    { header: 'Score', accessor: 'score' },
    { header: 'Submitted At', accessor: 'submittedAt' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (contestant: Contestant) => (
        <ActionButtons>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleView(contestant)}
          >
            View
          </Button>
          {contestant.status === 'pending' && (
            <>
              <Button
                variant="success"
                size="small"
                onClick={() => handleStatusChange(contestant.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => handleStatusChange(contestant.id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
          {contestant.status === 'approved' && (
            <Button
              variant="primary"
              size="small"
              onClick={() => handleScoreUpdate(contestant.id, 0)}
            >
              Update Score
            </Button>
          )}
        </ActionButtons>
      ),
    },
  ];

  return (
    <ContestantManagementContainer>
      <Header>
        <Title>Contestant Management</Title>
      </Header>

      <SearchBar>
        <Input
          type="text"
          placeholder="Search contestants..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </SearchBar>

      <Card>
        <Table
          columns={columns}
          data={filteredContestants}
          keyExtractor={(contestant) => contestant.id}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="View Submission"
      >
        {selectedContestant && (
          <div>
            <h3>{selectedContestant.name}'s Submission</h3>
            <p>Contest: {selectedContestant.contest}</p>
            <p>Submission: {selectedContestant.submission}</p>
            <p>Status: {selectedContestant.status}</p>
            {selectedContestant.score && <p>Score: {selectedContestant.score}</p>}
            <p>Submitted At: {selectedContestant.submittedAt}</p>
          </div>
        )}
      </Modal>
    </ContestantManagementContainer>
  );
};

export default ContestantManagement;