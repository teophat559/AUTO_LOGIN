import { useState, useCallback } from 'react';
import { Contest } from '../types/contest';

export const useContests = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to fetch contests
      const response = await fetch('/api/contests');
      const data = await response.json();
      setContests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contests');
    } finally {
      setLoading(false);
    }
  }, []);

  const addContest = useCallback(async (contest: Omit<Contest, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to add contest
      const response = await fetch('/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contest),
      });
      const data = await response.json();
      setContests(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contest');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContest = useCallback(async (id: string, contest: Partial<Contest>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to update contest
      const response = await fetch(`/api/contests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contest),
      });
      const data = await response.json();
      setContests(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contest');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContest = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to delete contest
      await fetch(`/api/contests/${id}`, {
        method: 'DELETE',
      });
      setContests(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contest');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contests,
    loading,
    error,
    fetchContests,
    addContest,
    updateContest,
    deleteContest,
  };
};