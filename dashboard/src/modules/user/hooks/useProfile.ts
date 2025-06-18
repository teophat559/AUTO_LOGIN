import { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/profile';
import { profileService } from '../services/profileService';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update profile');
    }
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      await profileService.changePassword(data);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to change password');
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const result = await profileService.uploadAvatar(file);
      if (profile) {
        setProfile({ ...profile, avatar: result.avatarUrl });
      }
      return result;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload avatar');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
  };
};