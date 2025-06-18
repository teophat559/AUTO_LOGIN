export interface Statistics {
  totalUsers: number;
  totalContests: number;
  totalSubmissions: number;
  activeContests: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  userGrowth: {
    date: string;
    count: number;
  }[];
  contestParticipation: {
    contestId: string;
    contestTitle: string;
    participants: number;
  }[];
  submissionStatus: {
    status: string;
    count: number;
  }[];
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  contests: {
    total: number;
    active: number;
    upcoming: number;
    ended: number;
  };
  submissions: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}