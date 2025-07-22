import { api } from './api';
import { Session } from '@/types';

export const sessionsAPI = {
  getSessions: async (childId: string): Promise<Session[]> => {
    try {
      const response = await api.get(`/sessions/?child_id=${childId}`);
      return response.data;
    } catch (error) {
      // Mock data for development
      return [
        {
          id: 'session_1',
          childId: childId,
          date: '2024-01-15',
          score: 85,
          level: 2,
          duration: 1200, // 20 minutes
          completed: true,
          activities: [
            {
              id: 'activity_1',
              type: 'pronunciation',
              word: 'hello',
              correct: true,
              attempts: 1,
              timestamp: '2024-01-15T10:00:00Z'
            },
            {
              id: 'activity_2',
              type: 'vocabulary',
              word: 'cat',
              correct: true,
              attempts: 2,
              timestamp: '2024-01-15T10:05:00Z'
            }
          ]
        },
        {
          id: 'session_2',
          childId: childId,
          date: '2024-01-14',
          score: 72,
          level: 2,
          duration: 900, // 15 minutes
          completed: true,
          activities: []
        },
        {
          id: 'session_3',
          childId: childId,
          date: '2024-01-13',
          score: 95,
          level: 1,
          duration: 1500, // 25 minutes
          completed: true,
          activities: []
        }
      ];
    }
  },

  createSession: async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
    try {
      const response = await api.post('/sessions/', sessionData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create session');
    }
  },

  updateSession: async (id: string, sessionData: Partial<Session>): Promise<Session> => {
    try {
      const response = await api.patch(`/sessions/${id}/`, sessionData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update session');
    }
  }
};