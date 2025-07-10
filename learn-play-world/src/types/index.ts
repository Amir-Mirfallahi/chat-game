export interface User {
  id: string;
  username: string;
  email?: string;
  token: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  nativeLanguage: string;
  avatar: string;
  userId: string;
  level: number;
  totalScore: number;
  lives: number;
}

export interface Session {
  id: string;
  childId: string;
  date: string;
  score: number;
  level: number;
  duration: number;
  completed: boolean;
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'pronunciation' | 'vocabulary' | 'listening';
  word: string;
  correct: boolean;
  attempts: number;
  timestamp: string;
}

export interface GameState {
  sessionId: string | null;
  currentLevel: number;
  score: number;
  lives: number;
  isPlaying: boolean;
  selectedChild: Child | null;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface GameContextType {
  gameState: GameState;
  updateScore: (points: number) => void;
  loseLife: () => void;
  levelUp: () => void;
  startSession: (childId: string) => void;
  endSession: () => void;
  selectChild: (child: Child) => void;
}