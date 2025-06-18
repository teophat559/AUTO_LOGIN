import { Submission } from './submission';

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  type: 'photo' | 'video' | 'art';
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  maxParticipants: number;
  currentParticipants: number;
  imageUrl?: string;
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContestDetail extends Contest {
  participants: Contestant[];
  submissions: Submission[];
}

export interface Contestant {
  id: string;
  userId: string;
  contestId: string;
  name: string;
  avatar?: string;
  votes: number;
  rank?: number;
  joinedAt: string;
}