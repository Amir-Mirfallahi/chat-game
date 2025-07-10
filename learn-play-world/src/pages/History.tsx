import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGame } from '@/context/GameContext';
import { Session } from '@/types';
import { sessionsAPI } from '@/services/sessions';
import { useToast } from '@/hooks/use-toast';

export const History: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { gameState } = useGame();
  const { toast } = useToast();

  useEffect(() => {
    if (gameState.selectedChild) {
      loadSessions();
    } else {
      setIsLoading(false);
    }
  }, [gameState.selectedChild]);

  const loadSessions = async () => {
    if (!gameState.selectedChild) return;
    
    try {
      const sessionsData = await sessionsAPI.getSessions(gameState.selectedChild.id);
      setSessions(sessionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load session history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-success/20';
    if (score >= 70) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gameState.selectedChild) {
    return (
      <div className="p-4 pb-24 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <div className="card-playful p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Select a Child First</h2>
            <p className="text-muted-foreground">
              Go to Dashboard and choose which child's history you'd like to view.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center bounce-in">
          <h1 className="text-3xl font-bold mb-2">
            {gameState.selectedChild.name}'s Progress 📊
          </h1>
          <p className="text-muted-foreground">
            Look how far you've come!
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary/20 text-center p-4">
            <p className="text-2xl font-bold text-primary-foreground">
              {sessions.length}
            </p>
            <p className="text-sm text-primary-foreground/80">Sessions</p>
          </Card>
          <Card className="bg-success/20 text-center p-4">
            <p className="text-2xl font-bold text-success-foreground">
              {sessions.length > 0 
                ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length)
                : 0}
            </p>
            <p className="text-sm text-success-foreground/80">Avg Score</p>
          </Card>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <Card className="card-playful">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-muted-foreground">
                Start your first learning session to see progress here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="card-playful hover:scale-102 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {formatDate(session.date)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Level {session.level}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-xl ${getScoreBackground(session.score)}`}>
                      <p className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                        {session.score}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatDuration(session.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">{session.activities.length} activities</span>
                      </div>
                    </div>
                    {session.completed && (
                      <div className="text-success text-sm font-semibold">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        session.score >= 90 ? 'bg-success' :
                        session.score >= 70 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${session.score}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};