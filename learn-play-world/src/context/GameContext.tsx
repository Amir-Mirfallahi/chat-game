import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GameContextType, Child } from '@/types';

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
  lives: 3,
  isPlaying: false,
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

  const loseLife = () => {
    setGameState(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1)
    }));
  };

  const levelUp = () => {
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      lives: 3 // Restore lives on level up
    }));
  };

  const startSession = (childId: string) => {
    setGameState(prev => ({
      ...prev,
      sessionId: `session_${Date.now()}`,
      isPlaying: true,
      score: 0,
      lives: 3
    }));
  };

  const endSession = () => {
    setGameState(prev => ({
      ...prev,
      sessionId: null,
      isPlaying: false
    }));
  };

  const selectChild = (child: Child) => {
    setGameState(prev => ({
      ...prev,
      selectedChild: child,
      currentLevel: child.level,
      score: 0,
      lives: 3
    }));
  };

  const value: GameContextType = {
    gameState,
    updateScore,
    loseLife,
    levelUp,
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