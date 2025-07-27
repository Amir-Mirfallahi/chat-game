import axios from 'axios';

// Django API base URL - adjust this to your actual API endpoint
const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if the token is expired, then refresh the token
      if (localStorage.getItem('auth_token') && localStorage.getItem('refresh_token')) {
        const refreshToken = localStorage.getItem('refresh_token');
        api.post('/auth/token/refresh/', { refresh: refreshToken })
        window.location.href = '/dashboard'; // Redirect to dashboard if token is valid
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);