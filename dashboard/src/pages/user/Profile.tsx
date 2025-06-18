import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, TextArea } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
`;

const AvatarSection = styled(Card)`
  padding: 1.5rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #6c757d;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarUpload = styled.div`
  margin-top: 1rem;
`;

const StatsSection = styled(Card)`
  padding: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  avatar: File | null;
}

const Profile: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Photography enthusiast and digital artist.',
    location: 'New York, USA',
    website: 'https://johndoe.com',
    avatar: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Implement profile update logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProfileContainer>
      <Header>
        <Title>My Profile</Title>
      </Header>

      <ProfileGrid>
        <div>
          <AvatarSection>
            <Avatar>
              {formData.avatar ? (
                <AvatarImage
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Profile"
                />
              ) : (
                '👤'
              )}
            </Avatar>
            <AvatarUpload>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <Button variant="secondary">
                  Change Avatar
                </Button>
              </label>
            </AvatarUpload>
          </AvatarSection>

          <StatsSection>
            <StatsGrid>
              <StatItem>
                <StatValue>12</StatValue>
                <StatLabel>Contests Joined</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>8</StatValue>
                <StatLabel>Submissions</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>3</StatValue>
                <StatLabel>Wins</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>95</StatValue>
                <StatLabel>Average Score</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsSection>
        </div>

        <Card>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <TextArea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default Profile;