import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Store, Users, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChildAvatar } from "@/components/common/ChildAvatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useGame } from "@/context/GameContext";
import { Child, PaginatedChildrenResponse } from "@/types";
import { childrenAPI } from "@/services/children";
import { useToast } from "@/hooks/use-toast";
import useChildStore from "@/stores/child";

export const Dashboard: React.FC = () => {
  const [children, setChildren] = useState<PaginatedChildrenResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const selectedChild = useChildStore((state) => state.selectedChild);
  const selectChild = useChildStore((state) => state.selectChild);
  const navigate = useNavigate();
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
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = (child: Child) => {
    selectChild(child);
    toast({
      title: `Welcome, Kid! 👋`,
      description: `Ready to play?`,
    });
  };

  const handleTalkToAgent = () => {
    if (!selectedChild) {
      toast({
        title: "Select a Child First",
        description: "Please choose which child wants to talk to the agent",
        variant: "destructive",
      });
      return;
    }
    navigate("/agent");
  };

  const handleAddChild = () => {
    selectChild(null);
    navigate("/profile");
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
            Choose Your Child <Users className="inline" />
          </h1>
          <p className="text-muted-foreground">Who's ready to learn today?</p>
        </div>

        {/* Children Selection */}
        <Card className="card-playful">
          <CardContent className="p-6">
            {children.results.length === 0 ? (
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
                  {children.results.map((child) => (
                    <ChildAvatar
                      key={child.id}
                      child={child}
                      size="lg"
                      onClick={() => handleChildSelect(child)}
                      isSelected={selectedChild?.id === child.id}
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
                {selectedChild && (
                  <div className="bg-primary/10 rounded-2xl p-4 text-center">
                    <p className="text-sm text-primary font-semibold">
                      {selectedChild.name} is Selected
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
          disabled={!selectedChild}
          className="btn-fun w-full h-16 text-xl"
        >
          <MessageSquare className="w-6 h-6 mr-2" />
          Talk to Agent! <Bot />
        </Button>
      </div>
    </div>
  );
};
