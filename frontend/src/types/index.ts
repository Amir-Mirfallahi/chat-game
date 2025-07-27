export interface User {
  id: string;
  username: string;
  email?: string;
  token: string;
}

export interface Child {
  id: string;
  age: number;
  native_language: string;
  user: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedChildrenResponse {
  count: number | 0;
  next?: string;
  previous?: string;
  results: Child[];
}

export interface Session {
  id: string;
  child: string;
  child_username: string;
  started_at: string;
}

export interface GameState {
  sessionId: string | null;
  currentLevel: number;
  score: number;
  selectedChild: Child | null;
}

interface childProfile {
  age: number;
  native_language: string;
}

export interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string, child_profile: childProfile) => Promise<void>;
  logout: () => void;
  refreshToken: (refreshToken: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface GameContextType {
  gameState: GameState;
  updateScore: (points: number) => void;
  startSession: (childId: string) => void;
  endSession: (sessionId: string) => void;
  selectChild: (child: Child) => void;
}