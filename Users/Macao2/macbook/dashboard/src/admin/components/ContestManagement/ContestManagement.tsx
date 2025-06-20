import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Card, Button, Input, Modal, Toast } from '../../../components/common';
import { useToast } from '../../../hooks/useToast';
import { useContests } from '../../../hooks/useContests';
import { Contest } from '../../../types/contest';

interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: 'active' | 'upcoming' | 'ended';
}

const Container = styled.div`
  padding: ${theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSize.xxl};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ContestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;

const ContestCard = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ContestImage = styled.div<{ imageUrl: string }>`
  height: 200px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
`;

const ContestContent = styled.div`
  padding: ${theme.spacing.md};
`;

const ContestTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

const ContestDescription = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.md};
`;

const ContestDates = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
`;

const ContestActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const StatusBadge = styled.span<{ status: Contest['status'] }>`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  background: ${props => {
    switch (props.status) {
      case 'active':
        return theme.colors.success;
      case 'upcoming':
        return theme.colors.warning;
      case 'ended':
        return theme.colors.error;
    }
  }};
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ImageUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.default};

  &:hover {
    border-color: ${theme.colors.primary};
    background: ${theme.colors.background.paper};
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: ${theme.borderRadius.md};
`;

const ContestManagement: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([
    {
      id: '1',
      title: 'Cuộc thi Hoa hậu Việt Nam 2024',
      description: 'Cuộc thi sắc đẹp lớn nhất Việt Nam',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      imageUrl: 'https://example.com/contest1.jpg',
      status: 'upcoming',
    },
    // Thêm dữ liệu mẫu khác
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleAddContest = () => {
    setSelectedContest(null);
    setIsModalOpen(true);
  };

  const handleEditContest = (contest: Contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const handleDeleteContest = (contestId: string) => {
    setContests(contests.filter(contest => contest.id !== contestId));
    showToast('Đã xóa cuộc thi thành công', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm/sửa cuộc thi
    setIsModalOpen(false);
    showToast(
      selectedContest
        ? 'Đã cập nhật cuộc thi thành công'
        : 'Đã thêm cuộc thi mới thành công',
      'success'
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Xử lý upload ảnh
      showToast('Đã tải lên ảnh thành công', 'success');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Quản Lý Cuộc Thi</Title>
        <Button
          variant="primary"
          onClick={handleAddContest}
          startIcon={<AddIcon />}
        >
          Thêm Cuộc Thi
        </Button>
      </Header>

      <ContestGrid>
        {contests.map(contest => (
          <ContestCard key={contest.id}>
            <ContestImage imageUrl={contest.imageUrl} />
            <StatusBadge status={contest.status}>
              {contest.status === 'active'
                ? 'Đang diễn ra'
                : contest.status === 'upcoming'
                ? 'Sắp diễn ra'
                : 'Đã kết thúc'}
            </StatusBadge>
            <ContestContent>
              <ContestTitle>{contest.title}</ContestTitle>
              <ContestDescription>{contest.description}</ContestDescription>
              <ContestDates>
                <span>Bắt đầu: {contest.startDate}</span>
                <span>Kết thúc: {contest.endDate}</span>
              </ContestDates>
              <ContestActions>
                <Button
                  variant="secondary"
                  onClick={() => handleEditContest(contest)}
                  startIcon={<EditIcon />}
                >
                  Sửa
                </Button>
                <Button
                  variant="error"
                  onClick={() => handleDeleteContest(contest.id)}
                  startIcon={<DeleteIcon />}
                >
                  Xóa
                </Button>
              </ContestActions>
            </ContestContent>
          </ContestCard>
        ))}
      </ContestGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContest ? 'Sửa Cuộc Thi' : 'Thêm Cuộc Thi Mới'}
      >
        <Form onSubmit={handleSubmit}>
          <Input
            label="Tên cuộc thi"
            defaultValue={selectedContest?.title}
            required
          />
          <Input
            label="Mô tả"
            multiline
            rows={4}
            defaultValue={selectedContest?.description}
            required
          />
          <Input
            label="Ngày bắt đầu"
            type="date"
            defaultValue={selectedContest?.startDate}
            required
          />
          <Input
            label="Ngày kết thúc"
            type="date"
            defaultValue={selectedContest?.endDate}
            required
          />
          <ImageUpload>
            <ImageIcon />
            <span>Kéo thả hoặc click để tải ảnh lên</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="secondary">Chọn ảnh</Button>
            </label>
            {selectedContest?.imageUrl && (
              <PreviewImage src={selectedContest.imageUrl} alt="Preview" />
            )}
          </ImageUpload>
          <Button type="submit" variant="primary">
            {selectedContest ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </Container>
  );
};

export default ContestManagement;