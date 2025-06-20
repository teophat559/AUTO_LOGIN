export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ContestStatus;
  type: ContestType;
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
    honorable?: string[];
  };
  maxParticipants: number;
  currentParticipants: number;
  imageUrl: string;
  bannerUrl?: string;
  organizer: {
    id: string;
    name: string;
    logo?: string;
  };
  categories?: string[];
  tags?: string[];
  requirements?: {
    age?: {
      min?: number;
      max?: number;
    };
    location?: string[];
    skills?: string[];
  };
  submissionGuidelines?: string[];
  judgingCriteria?: {
    criteria: string;
    weight: number;
  }[];
  timeline?: {
    phase: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFeatured?: boolean;
  registrationDeadline?: string;
  entryFee?: number;
  currency?: string;
  contactEmail?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface ContestFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: ContestType;
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
    honorable?: string[];
  };
  maxParticipants: number;
  imageUrl: string;
  bannerUrl?: string;
  categories?: string[];
  tags?: string[];
  requirements?: {
    age?: {
      min?: number;
      max?: number;
    };
    location?: string[];
    skills?: string[];
  };
  submissionGuidelines?: string[];
  judgingCriteria?: {
    criteria: string;
    weight: number;
  }[];
  timeline?: {
    phase: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  isPublished: boolean;
  isFeatured?: boolean;
  registrationDeadline?: string;
  entryFee?: number;
  currency?: string;
  contactEmail?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export type ContestStatus = 'upcoming' | 'active' | 'ended' | 'draft' | 'cancelled';
export type ContestType = 'photo' | 'video' | 'writing' | 'art' | 'music' | 'design' | 'other';