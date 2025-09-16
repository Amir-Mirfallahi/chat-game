import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b-2 border-primary/20 px-4 py-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {/* Score */}
        <div className="flex items-center gap-2 bg-warning/20 px-3 py-2 rounded-xl">
          <img src="/logo.png" className="h-7" />
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className={`rounded-lg border-red-500 ${
            location.pathname === "/profile" ? "" : "hidden"
          }`}
        >
          Log out
          <LogOut className="inline" />
        </Button>
      </div>
    </header>
  );
};
