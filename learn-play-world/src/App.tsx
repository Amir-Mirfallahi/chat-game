import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { GameProvider } from "@/context/GameContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { History } from "@/pages/History";
import { Profile } from "@/pages/Profile";
import { Agent } from "@/pages/Agent";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>{children}</main>
    <BottomNavigation />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GameProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <AppLayout><History /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AppLayout><Profile /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/agent" element={
                <ProtectedRoute>
                  <AppLayout><Agent /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GameProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
