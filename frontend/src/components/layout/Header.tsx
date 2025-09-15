import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b-2 border-primary/20 px-4 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {/* Score */}
        <div className="flex items-center gap-2 bg-warning/20 px-3 py-2 rounded-xl">
          <img src="/logo.png" className="h-7" />
        </div>
      </div>
    </header>
  );
};
