import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GameState, GameContextType, Child } from "@/types";
import { sessionsAPI } from "@/services/sessions";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

const initialGameState: GameState = {
  livekitRoom: null,
  currentLevel: 1,
  score: 0,
  selectedChild: null,
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved) : initialGameState;
  });

  // Sync gameState -> localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [gameState]);

  const updateScore = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  };

  const startSession = async (childId: string) => {
    const session = await sessionsAPI.startSession(childId);
    setGameState((prev) => ({
      ...prev,
      livekitRoom: session.livekit_room,
    }));

    return session.livekit_room;
  };

  const endSession = async (sessionId: string) => {
    await sessionsAPI.endSession(sessionId);
    setGameState((prev) => ({
      ...prev,
      sessionId: null,
    }));
  };

  const selectChild = (child: Child) => {
    setGameState((prev) => ({
      ...prev,
      selectedChild: child,
      score: 0,
    }));
  };

  const value: GameContextType = {
    gameState,
    updateScore,
    startSession,
    endSession,
    selectChild,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
