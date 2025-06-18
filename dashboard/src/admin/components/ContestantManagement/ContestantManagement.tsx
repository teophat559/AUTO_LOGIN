import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Card, Button, Input, Modal, Toast, Avatar } from '../../../components/common';
import { useToast } from '../../../hooks/useToast';
import { useContestants } from '../../../hooks/useContestants';
import { Contestant } from '../../../types/contestant';
import { theme } from '../../../styles/theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

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

const ContestantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;

const ContestantCard = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ContestantImage = styled.div<{ imageUrl: string }>`
  height: 300px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
`;

const ContestantContent = styled.div`
  padding: ${theme.spacing.md};
`;

const ContestantName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
`;

const ContestantInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const InfoItem = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const InfoLabel = styled.span`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
`;

const ContestantBio = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContestantActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const VoteCount = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-weight: ${theme.typography.fontWeight.medium};
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

const ContestantManagement: React.FC = () => {
  const [contestants, setContestants] = useState<Contestant[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      age: 20,
      height: 170,
      weight: 50,
      measurements: '85-60-85',
      hometown: 'Hà Nội',
      occupation: 'Sinh viên',
      bio: 'Thí sinh đến từ Hà Nội với ước mơ trở thành người mẫu chuyên nghiệp.',
      imageUrl: 'https://example.com/contestant1.jpg',
      contestId: '1',
      votes: 1000,
    },
    // Thêm dữ liệu mẫu khác
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(
    null
  );
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

  const handleAddContestant = () => {
    setSelectedContestant(null);
    setIsModalOpen(true);
  };

  const handleEditContestant = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    setIsModalOpen(true);
  };

  const handleDeleteContestant = (contestantId: string) => {
    setContestants(contestants.filter(c => c.id !== contestantId));
    showToast('Đã xóa thí sinh thành công', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm/sửa thí sinh
    setIsModalOpen(false);
    showToast(
      selectedContestant
        ? 'Đã cập nhật thí sinh thành công'
        : 'Đã thêm thí sinh mới thành công',
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
        <Title>Quản Lý Thí Sinh</Title>
        <Button
          variant="primary"
          onClick={handleAddContestant}
        >
          <AddIcon style={{ marginRight: '8px' }} />
          Thêm Thí Sinh
        </Button>
      </Header>

      <ContestantGrid>
        {contestants.map(contestant => (
          <ContestantCard key={contestant.id}>
            <ContestantImage imageUrl={contestant.imageUrl} />
            <VoteCount>{contestant.votes} lượt bình chọn</VoteCount>
            <ContestantContent>
              <ContestantName>{contestant.name}</ContestantName>
              <ContestantInfo>
                <InfoItem>
                  <InfoLabel>Tuổi:</InfoLabel> {contestant.age}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Chiều cao:</InfoLabel> {contestant.height}cm
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Cân nặng:</InfoLabel> {contestant.weight}kg
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Số đo:</InfoLabel> {contestant.measurements}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Quê quán:</InfoLabel> {contestant.hometown}
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Nghề nghiệp:</InfoLabel> {contestant.occupation}
                </InfoItem>
              </ContestantInfo>
              <ContestantBio>{contestant.bio}</ContestantBio>
              <ContestantActions>
                <Button
                  variant="secondary"
                  onClick={() => handleEditContestant(contestant)}
                >
                  <EditIcon style={{ marginRight: '8px' }} />
                  Sửa
                </Button>
                <Button
                  variant="primary"
                  danger
                  onClick={() => handleDeleteContestant(contestant.id)}
                >
                  <DeleteIcon style={{ marginRight: '8px' }} />
                  Xóa
                </Button>
              </ContestantActions>
            </ContestantContent>
          </ContestantCard>
        ))}
      </ContestantGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContestant ? 'Sửa Thí Sinh' : 'Thêm Thí Sinh Mới'}
      >
        <Form onSubmit={handleSubmit}>
          <Input
            label="Họ và tên"
            defaultValue={selectedContestant?.name}
            required
          />
          <Input
            label="Tuổi"
            type="number"
            defaultValue={selectedContestant?.age}
            required
          />
          <Input
            label="Chiều cao (cm)"
            type="number"
            defaultValue={selectedContestant?.height}
            required
          />
          <Input
            label="Cân nặng (kg)"
            type="number"
            defaultValue={selectedContestant?.weight}
            required
          />
          <Input
            label="Số đo"
            defaultValue={selectedContestant?.measurements}
            required
          />
          <Input
            label="Quê quán"
            defaultValue={selectedContestant?.hometown}
            required
          />
          <Input
            label="Nghề nghiệp"
            defaultValue={selectedContestant?.occupation}
            required
          />
          <Input
            label="Tiểu sử"
            multiline
            rows={4}
            defaultValue={selectedContestant?.bio}
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
            {selectedContestant?.imageUrl && (
              <PreviewImage src={selectedContestant.imageUrl} alt="Preview" />
            )}
          </ImageUpload>
          <Button type="submit" variant="primary">
            {selectedContestant ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form>
      </Modal>

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </Container>
  );
};

export default ContestantManagement;