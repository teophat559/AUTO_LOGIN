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
  isPublished: boolean;
}

export interface CreateContestRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'photo' | 'video' | 'art';
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  maxParticipants: number;
  imageUrl?: string;
  organizer: string;
}

export interface UpdateContestRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: 'upcoming' | 'active' | 'ended';
  type?: 'photo' | 'video' | 'art';
  rules?: string[];
  prizes?: {
    first: string;
    second: string;
    third: string;
  };
  maxParticipants?: number;
  imageUrl?: string;
  organizer?: string;
  isPublished?: boolean;
}