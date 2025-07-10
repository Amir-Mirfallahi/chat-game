import { api } from './api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email?: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      // Mock response for development
      if (username === 'demo' && password === 'demo') {
        return {
          token: 'mock_token_' + Date.now(),
          user: {
            id: 'user_1',
            username: 'demo',
            email: 'demo@example.com'
          }
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/register/', data);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      // Silent fail - just clear local storage
    }
  }
};