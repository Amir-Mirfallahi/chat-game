import { api } from './api';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  child_profile: {
    age: number;
    native_language: string;
  };
}

export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
      const response = await api.post('/auth/login/', {
        username,
        password
      });
      return response.data;
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
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    } catch (error) {
      // Silent fail - just clear local storage
    }
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken
    });
    return response.data;
  }
};