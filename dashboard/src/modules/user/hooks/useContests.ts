import { useState, useEffect } from 'react';
import { Contest, ContestDetail } from '../types/contest';
import { contestService } from '../services/contestService';

export const useContests = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const data = await contestService.getContests();
      setContests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  };

  const getContest = async (id: string): Promise<ContestDetail> => {
    try {
      return await contestService.getContest(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch contest');
    }
  };

  const joinContest = async (contestId: string) => {
    try {
      await contestService.joinContest(contestId);
      // Refresh contests list
      await fetchContests();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to join contest');
    }
  };

  const leaveContest = async (contestId: string) => {
    try {
      await contestService.leaveContest(contestId);
      // Refresh contests list
      await fetchContests();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to leave contest');
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return {
    contests,
    loading,
    error,
    fetchContests,
    getContest,
    joinContest,
    leaveContest,
  };
};