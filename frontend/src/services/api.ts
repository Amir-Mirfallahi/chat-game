import axios from "axios";

// Django API base URL - adjust this to your actual API endpoint
const API_BASE_URL = "http://65.21.245.135:8000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, attempt token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        // Update tokens in storage
        localStorage.setItem("auth_token", data.access);
        localStorage.setItem("refresh_token", data.refresh || refreshToken);

        // Update axios headers
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token invalid or expired
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors or if no refresh possible, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
