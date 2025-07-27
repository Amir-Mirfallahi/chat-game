import React from 'react';
import { Star, Heart, TrendingUp } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export const Header: React.FC = () => {
  const { gameState } = useGame();

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b-2 border-primary/20 px-4 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {/* Score */}
        <div className="flex items-center gap-2 bg-warning/20 px-3 py-2 rounded-xl">
          <Star className="w-5 h-5 text-warning-foreground fill-current" />
          <span className="font-bold text-warning-foreground">CHAT</span>
        </div>
      </div>
    </header>
  );
};