import { api } from './api';
import { Child } from '@/types';

export const childrenAPI = {
  getChildren: async (): Promise<Child[]> => {
    try {
      const response = await api.get('/children/');
      return response.data;
    } catch (error) {
      // Mock data for development
      return [
        {
          id: 'child_1',
          name: 'Emma',
          age: 6,
          nativeLanguage: 'Spanish',
          avatar: '👧',
          userId: 'user_1',
          level: 2,
          totalScore: 150,
          lives: 3
        },
        {
          id: 'child_2',
          name: 'Lucas',
          age: 8,
          nativeLanguage: 'French',
          avatar: '👦',
          userId: 'user_1',
          level: 3,
          totalScore: 280,
          lives: 3
        }
      ];
    }
  },

  createChild: async (childData: Omit<Child, 'id' | 'userId' | 'totalScore' | 'lives'>): Promise<Child> => {
    try {
      const response = await api.post('/children/', childData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create child profile');
    }
  },

  updateChild: async (id: string, childData: Partial<Child>): Promise<Child> => {
    try {
      const response = await api.patch(`/children/${id}/`, childData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update child profile');
    }
  },

  deleteChild: async (id: string): Promise<void> => {
    try {
      await api.delete(`/children/${id}/`);
    } catch (error) {
      throw new Error('Failed to delete child profile');
    }
  }
};