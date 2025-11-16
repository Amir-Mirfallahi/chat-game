import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthContextType, ChildProfile } from "@/types";
import { authAPI } from "@/services/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app start
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user_data");

    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(username, password);

      localStorage.setItem("auth_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (refreshToken: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.refreshToken(refreshToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    password: string,
    email: string,
    children: ChildProfile
  ) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({
        username,
        password,
        email,
        children,
      });
      await login(username, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  const value: AuthContextType = {
    login,
    logout,
    register,
    refreshToken,
    isLoading,
    isAuthenticated: localStorage.getItem("auth_token") !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
