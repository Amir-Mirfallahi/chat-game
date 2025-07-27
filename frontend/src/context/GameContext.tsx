import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GameContextType, Child } from '@/types';
import { sessionsAPI } from '@/services/sessions';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

const initialGameState: GameState = {
  sessionId: null,
  currentLevel: 1,
  score: 0,
  selectedChild: null
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const updateScore = (points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  };

  const startSession = async (childId: string) => {
    const session = await sessionsAPI.startSession(childId)
    setGameState(prev => ({
      ...prev,
      sessionId: session.id
    }));
    return session.id // Return session ID for further use
  };

  const endSession = async (sessionId: string) => {
    await sessionsAPI.endSession(sessionId)
    setGameState(prev => 
      ({
      ...prev,
      sessionId: null,
      })
    );
  };

  const selectChild = (child: Child) => {
    setGameState(prev => ({
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
    selectChild
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};