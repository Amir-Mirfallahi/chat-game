import { api } from './api';
import { Session } from '@/types';

export const sessionsAPI = {
  getSessions: async (childId: string): Promise<Session[]> => {
    try {
      const response = await api.get(`/sessions/?child_id=${childId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch sesions');
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