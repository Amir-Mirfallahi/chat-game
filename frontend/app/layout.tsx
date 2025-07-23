"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { GameProvider } from "@/context/GameContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import "./globals.css";
import "./App.css";
import "./index.css";
import { usePathname } from "next/navigation";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>{children}</main>
    <BottomNavigation />
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showAppLayout = !['/login', '/'].includes(pathname);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <GameProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {showAppLayout ? <AppLayout>{children}</AppLayout> : children}
              </TooltipProvider>
            </GameProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
