import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/context/GameContext";
import { childrenAPI } from "@/services/children";
import { useToast } from "@/hooks/use-toast";
import useChildStore from "@/stores/child";
import { Textarea } from "@/components/ui/textarea";

export const Profile: React.FC = () => {
  const [name, setName] = useState("");
  const [conversationPrompt, setConversationPrompt] = useState("");
  const [age, setAge] = useState("");
  const [native_language, setnative_language] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedChild = useChildStore((state) => state.selectedChild);
  const selectChild = useChildStore((state) => state.selectChild);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedChild) {
      setName(selectedChild.name);
      setAge(selectedChild.age.toString());
      setnative_language(selectedChild.native_language.toLowerCase());
      setConversationPrompt(selectedChild.conversation_prompt);
    }
  }, [selectedChild]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the child",
        variant: "destructive",
      });
      return;
    }

    if (!age || parseInt(age) < 3 || parseInt(age) > 17) {
      toast({
        title: "Invalid Age",
        description: "Age must be between 3 and 17",
        variant: "destructive",
      });
      return;
    }

    if (!native_language) {
      toast({
        title: "Language Required",
        description: "Please select a native language",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const childData = {
        name: name.trim(),
        age: parseInt(age),
        native_language: "en",
        conversation_prompt: conversationPrompt,
      };

      let savedChild;
      if (selectedChild) {
        // Update existing child
        savedChild = await childrenAPI.updateChild(selectedChild.id, childData);
        toast({
          title: "Profile Updated! ✨",
          description: `${name}'s profile has been updated`,
        });
      } else {
        // Create new child
        savedChild = await childrenAPI.createChild(childData);
        toast({
          title: "Welcome! 🎉",
          description: `${name}'s profile has been created`,
        });
      }

      selectChild(savedChild);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bounce-in">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {selectedChild ? "Edit Profile" : "Create Profile"}
            </h1>
            <p className="text-muted-foreground">
              {selectedChild
                ? "Update child information"
                : "Set up a new child profile"}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Child Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter child's name"
                  className="h-12 text-lg rounded-xl border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-semibold">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="3"
                  max="17"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age (3-17)"
                  className="h-12 text-lg rounded-xl border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {/* Conversation Prompt */}
              <div className="space-y-2">
                <Label
                  htmlFor="conversationPrompt"
                  className="text-base font-semibold"
                >
                  Conversation Prompt (optional)
                </Label>
                <Textarea
                  id="conversationPrompt"
                  value={conversationPrompt}
                  onChange={(e) => setConversationPrompt(e.target.value)}
                  placeholder="Enter a conversation prompt"
                  className="rounded-xl border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {/* Native Language */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Native Language
                </Label>
                <Select
                  value={native_language}
                  onValueChange={setnative_language}
                  disabled={true}
                >
                  <SelectTrigger className="h-12 text-lg rounded-xl border-2">
                    <SelectValue placeholder="Select native language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-success w-full h-14 text-xl"
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading
                  ? "Saving..."
                  : selectedChild
                  ? "Update Profile"
                  : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
