import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Save, ArrowLeft, User, LogOut } from "lucide-react";
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
  const [native_language, setnative_language] = useState("en");
  const [isLoading, setIsLoading] = useState(false);

  const selectedChild = useChildStore((state) => state.selectedChild);
  const selectChild = useChildStore((state) => state.selectChild);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t("translations:profile_toast_name_required_title"),
        description: t("translations:profile_toast_name_required_desc"),
        variant: "destructive",
      });
      return;
    }

    if (!age || parseInt(age) < 1 || parseInt(age) > 8) {
      toast({
        title: t("translations:profile_toast_age_invalid_title"),
        description: t("translations:profile_toast_age_invalid_desc"),
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
          title: t("translations:profile_toast_updated_title"),
          description: t("translations:profile_toast_updated_desc", { name }),
        });
      } else {
        // Create new child
        savedChild = await childrenAPI.createChild(childData);
        toast({
          title: t("translations:profile_toast_created_title"),
          description: t("translations:profile_toast_created_desc", { name }),
        });
      }

      selectChild(savedChild);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t("translations:profile_toast_error_title"),
        description: t("translations:profile_toast_error_desc"),
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
              {selectedChild ? t("translations:profile_edit_title") : t("translations:profile_create_title")}
            </h1>
            <p className="text-muted-foreground">
              {selectedChild
                ? t("translations:profile_edit_subtitle")
                : t("translations:profile_create_subtitle")}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t("translations:profile_card_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  {t("translations:profile_name_label")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("translations:profile_name_placeholder")}
                  className="h-12 text-lg rounded-xl border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-semibold">
                  {t("translations:profile_age_label")}
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="8"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t("translations:profile_age_placeholder")}
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
                  {t("translations:profile_conversation_label")}
                </Label>
                <Textarea
                  id="conversationPrompt"
                  value={conversationPrompt}
                  onChange={(e) => setConversationPrompt(e.target.value)}
                  placeholder={t("translations:profile_conversation_placeholder")}
                  className="rounded-xl border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              {/* Native Language */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {t("translations:profile_language_label")}
                </Label>
                <Select
                  value={native_language}
                  onValueChange={setnative_language}
                  disabled={true}
                >
                  <SelectTrigger className="h-12 text-lg rounded-xl border-2">
                    <SelectValue placeholder={t("translations:profile_language_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("translations:profile_language_english")}</SelectItem>
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
                  ? t("translations:profile_saving_button")
                  : selectedChild
                  ? t("translations:profile_update_button")
                  : t("translations:profile_save_button")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
