import { useState, useEffect } from 'react';
import { Submission, CreateSubmissionRequest, UpdateSubmissionRequest } from '../types/submission';
import { submissionService } from '../services/submissionService';

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await submissionService.getSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const getSubmission = async (id: string): Promise<Submission> => {
    try {
      return await submissionService.getSubmission(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch submission');
    }
  };

  const createSubmission = async (data: CreateSubmissionRequest): Promise<Submission> => {
    try {
      const newSubmission = await submissionService.createSubmission(data);
      setSubmissions(prev => [...prev, newSubmission]);
      return newSubmission;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create submission');
    }
  };

  const updateSubmission = async (id: string, data: UpdateSubmissionRequest): Promise<Submission> => {
    try {
      const updatedSubmission = await submissionService.updateSubmission(id, data);
      setSubmissions(prev =>
        prev.map(s => s.id === id ? updatedSubmission : s)
      );
      return updatedSubmission;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update submission');
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await submissionService.deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete submission');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    getSubmission,
    createSubmission,
    updateSubmission,
    deleteSubmission,
  };
};