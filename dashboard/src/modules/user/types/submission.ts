export interface Submission {
  id: string;
  userId: string;
  contestId: string;
  title: string;
  description?: string;
  files: string[];
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  feedback?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface CreateSubmissionRequest {
  contestId: string;
  title: string;
  description?: string;
  files: File[];
}

export interface UpdateSubmissionRequest {
  title?: string;
  description?: string;
  files?: File[];
}