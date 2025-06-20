import { useState, useCallback } from 'react';
import { Contestant } from '../types/contestant';

export const useContestants = () => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContestants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to fetch contestants
      const response = await fetch('/api/contestants');
      const data = await response.json();
      setContestants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contestants');
    } finally {
      setLoading(false);
    }
  }, []);

  const addContestant = useCallback(async (contestant: Omit<Contestant, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to add contestant
      const response = await fetch('/api/contestants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contestant),
      });
      const data = await response.json();
      setContestants(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contestant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContestant = useCallback(async (id: string, contestant: Partial<Contestant>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to update contestant
      const response = await fetch(`/api/contestants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contestant),
      });
      const data = await response.json();
      setContestants(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update contestant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContestant = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement API call to delete contestant
      await fetch(`/api/contestants/${id}`, {
        method: 'DELETE',
      });
      setContestants(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contestant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contestants,
    loading,
    error,
    fetchContestants,
    addContestant,
    updateContestant,
    deleteContestant,
  };
};