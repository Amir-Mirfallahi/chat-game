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

export interface Analytics {
  id: string;
  session: string; // session PK/UUID as string
  child: string;
  child_vocalizations: number;
  session_duration: string | null; // serializer can return null
  assistant_responses: number;
  avg_child_utterance_length: number | null;
  unique_child_words: number;
  encouragements_given: number;
  child_to_ai_ratio: number | null;
  topics_detected: string[]; // JSON list of topics
  best_utterance: string | string[] | null;
  conversation_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedAnalyticsResponse {
  count: number | 0;
  next?: string;
  previous?: string;
  results: Analytics[];
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

// Interface for token response from backend
export interface TokenResponse {
  token: string;
  source?: string;
  error?: string;
}
