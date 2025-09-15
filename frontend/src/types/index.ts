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
  parent: number;
  conversation_prompt: string;
  name: string;
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
  livekit_room: string;
}

export interface GameState {
  livekitRoom: string | null;
  currentLevel: number;
  score: number;
  selectedChild: Child | null;
}

export interface ChildProfile {
  age: number;
  native_language: string;
  name: string;
  conversation_prompt: string;
}

export interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string,
    children: ChildProfile[]
  ) => Promise<void>;
  logout: () => void;
  refreshToken: (refreshToken: string) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface GameContextType {
  gameState: GameState;
  updateScore: (points: number) => void;
  startSession: (childId: string) => Promise<string>;
  endSession: (sessionId: string) => void;
  selectChild: (child: Child) => void;
}
