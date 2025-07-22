"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChildAvatar } from '@/components/common/ChildAvatar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGame } from '@/context/GameContext';
import { Child } from '@/types';
import { childrenAPI } from '@/services/children';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { gameState, selectChild } = useGame();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const childrenData = await childrenAPI.getChildren();
      setChildren(childrenData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load children profiles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = (child: Child) => {
    selectChild(child);
    toast({
      title: `Welcome, ${child.name}! 👋`,
      description: `Ready for Level ${child.level}?`,
    });
  };

  const handleTalkToAgent = () => {
    if (!gameState.selectedChild) {
      toast({
        title: "Select a Child First",
        description: "Please choose which child wants to talk to the agent",
        variant: "destructive"
      });
      return;
    }
    router.push('/agent');
  };

  const handleAddChild = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center bounce-in">
          <h1 className="text-3xl font-bold mb-2">
            Choose Your Child 👨‍👩‍👧‍👦
          </h1>
          <p className="text-muted-foreground">
            Who's ready to learn today?
          </p>
        </div>

        {/* Children Selection */}
        <Card className="card-playful">
          <CardContent className="p-6">
            {children.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Children Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first child profile to get started!
                </p>
                <Button onClick={handleAddChild} className="btn-playful">
                  Add Child Profile
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Children Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {children.map((child) => (
                    <ChildAvatar
                      key={child.id}
                      child={child}
                      size="lg"
                      onClick={() => handleChildSelect(child)}
                      isSelected={gameState.selectedChild?.id === child.id}
                      className="w-full"
                    />
                  ))}

                  {/* Add Child Button */}
                  <div
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={handleAddChild}
                  >
                    <div className="w-32 h-32 rounded-full bg-muted border-4 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-200">
                      <Plus className="w-12 h-12 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <p className="font-bold text-muted-foreground group-hover:text-primary">
                      Add Child
                    </p>
                  </div>
                </div>

                {/* Selected Child Info */}
                {gameState.selectedChild && (
                  <div className="bg-primary/10 rounded-2xl p-4 text-center">
                    <p className="text-sm text-primary font-semibold">
                      Selected: {gameState.selectedChild.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Level {gameState.selectedChild.level} • {gameState.selectedChild.totalScore} points
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Talk to Agent Button */}
        <Button
          onClick={handleTalkToAgent}
          disabled={!gameState.selectedChild}
          className="btn-fun w-full h-16 text-xl"
        >
          <MessageSquare className="w-6 h-6 mr-2" />
          Talk to Agent! 🤖
        </Button>

        {/* Quick Stats */}
        {gameState.selectedChild && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-success/20 text-center p-3">
              <p className="text-2xl font-bold text-success-foreground">
                {gameState.selectedChild.level}
              </p>
              <p className="text-xs text-success-foreground/80">Level</p>
            </Card>
            <Card className="bg-warning/20 text-center p-3">
              <p className="text-2xl font-bold text-warning-foreground">
                {gameState.selectedChild.totalScore}
              </p>
              <p className="text-xs text-warning-foreground/80">Points</p>
            </Card>
            <Card className="bg-primary/20 text-center p-3">
              <p className="text-2xl font-bold text-primary-foreground">
                {gameState.selectedChild.lives}
              </p>
              <p className="text-xs text-primary-foreground/80">Lives</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
