import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, Avatar } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const ProfileContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

const ProfileCard = styled(Card)`
  padding: 1.5rem;
  text-align: center;
`;

const AvatarContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const UserName = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #212529;
`;

const UserRole = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 0.875rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const DetailsCard = styled(Card)`
  padding: 1.5rem;
`;

const CardTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #212529;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    bio: 'System administrator with 5 years of experience',
    phone: '+1 234 567 890',
    location: 'New York, USA',
    avatar: 'https://via.placeholder.com/150',
  });

  const [stats] = useState({
    contests: 12,
    participants: 150,
    submissions: 450,
  });

  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save the profile to your backend
    showToast('Profile updated successfully', 'success');
  };

  const handleChangePassword = () => {
    // Here you would typically show a change password modal
    showToast('Change password functionality coming soon', 'info');
  };

  return (
    <ProfileContainer>
      <Header>
        <Title>Profile</Title>
      </Header>

      <ProfileGrid>
        <ProfileCard>
          <AvatarContainer>
            <Avatar src={profile.avatar} size={150} />
          </AvatarContainer>
          <UserName>{profile.name}</UserName>
          <UserRole>{profile.role}</UserRole>

          <StatsGrid>
            <StatItem>
              <StatValue>{stats.contests}</StatValue>
              <StatLabel>Contests</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.participants}</StatValue>
              <StatLabel>Participants</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.submissions}</StatValue>
              <StatLabel>Submissions</StatLabel>
            </StatItem>
          </StatsGrid>
        </ProfileCard>

        <DetailsCard>
          <CardTitle>Personal Information</CardTitle>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
            />
          </FormGroup>

          <ButtonGroup>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </ButtonGroup>
        </DetailsCard>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile;