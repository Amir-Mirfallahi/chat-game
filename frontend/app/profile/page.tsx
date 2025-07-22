"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import { childrenAPI } from '@/services/children';
import { useToast } from '@/hooks/use-toast';

const LANGUAGES = [
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'korean', label: 'Korean' },
];

const AVATARS = ['👧', '👦', '🧒', '👶', '🧑', '👩', '👨', '🦄', '🐱', '🐶', '🐻', '🦊'];

const Profile: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👧');
  const [isLoading, setIsLoading] = useState(false);

  const { gameState, selectChild } = useGame();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (gameState.selectedChild) {
      setName(gameState.selectedChild.name);
      setAge(gameState.selectedChild.age.toString());
      setNativeLanguage(gameState.selectedChild.nativeLanguage.toLowerCase());
      setSelectedAvatar(gameState.selectedChild.avatar);
    }
  }, [gameState.selectedChild]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the child",
        variant: "destructive"
      });
      return;
    }

    if (!age || parseInt(age) < 3 || parseInt(age) > 17) {
      toast({
        title: "Invalid Age",
        description: "Age must be between 3 and 17",
        variant: "destructive"
      });
      return;
    }

    if (!nativeLanguage) {
      toast({
        title: "Language Required",
        description: "Please select a native language",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const childData = {
        name: name.trim(),
        age: parseInt(age),
        nativeLanguage: LANGUAGES.find(l => l.value === nativeLanguage)?.label || '',
        avatar: selectedAvatar,
        level: gameState.selectedChild?.level || 1
      };

      let savedChild;
      if (gameState.selectedChild) {
        // Update existing child
        savedChild = await childrenAPI.updateChild(gameState.selectedChild.id, childData);
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
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
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
            onClick={() => router.push('/dashboard')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {gameState.selectedChild ? 'Edit Profile' : 'Create Profile'}
            </h1>
            <p className="text-muted-foreground">
              {gameState.selectedChild ? 'Update child information' : 'Set up a new child profile'}
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
              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Choose Avatar</Label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-all duration-200 ${
                        selectedAvatar === avatar
                          ? 'border-primary bg-primary/10 scale-110'
                          : 'border-border hover:border-primary/50 hover:scale-105'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

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

              {/* Native Language */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Native Language
                </Label>
                <Select value={nativeLanguage} onValueChange={setNativeLanguage}>
                  <SelectTrigger className="h-12 text-lg rounded-xl border-2">
                    <SelectValue placeholder="Select native language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
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
                {isLoading ? 'Saving...' : gameState.selectedChild ? 'Update Profile' : 'Create Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{selectedAvatar}</span>
              <div>
                <p className="font-bold">{name || 'Child Name'}</p>
                <p className="text-sm text-muted-foreground">
                  Age {age || '?'} • {LANGUAGES.find(l => l.value === nativeLanguage)?.label || 'Language'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
