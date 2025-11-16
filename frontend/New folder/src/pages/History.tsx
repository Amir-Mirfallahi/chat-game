import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, Star, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Analytics } from "@/types";
import { analyticsAPI } from "@/services/analytics";
import { useToast } from "@/hooks/use-toast";
import useChildStore from "@/stores/child";

export const History: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedChild = useChildStore((state) => state.selectedChild);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedChild) {
      loadSessions();
    } else {
      setIsLoading(false);
    }
  }, [selectedChild]);

  const loadSessions = async () => {
    if (!selectedChild) return;

    try {
      const sessionsData = await analyticsAPI.getAnalytics(selectedChild.id);
      setAnalytics(sessionsData.results);
    } catch (error) {
      toast({
        title: t("translations:toast_error_title"),
        description: t("translations:toast_load_history_failed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const avgVocalizations = () => {
    if (analytics.length === 0) return 0;
    const total = analytics.reduce(
      (acc, a) => acc + (a.child_vocalizations ?? 0),
      0
    );
    return Math.round(total / analytics.length);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="p-4 pb-24 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <div className="card-playful p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t("translations:select_child_first")}</h2>
            <p className="text-muted-foreground">
              {t("translations:history_select_child_desc")}
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
            {t("translations:progress_title", { name: selectedChild.name })}
          </h1>
          <p className="text-muted-foreground">{t("translations:progress_subtitle")}</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary text-center p-4">
            <p className="text-2xl font-bold text-primary-foreground">
              {analytics.length}
            </p>
            <p className="text-sm text-primary-foreground">{t("translations:analytic_entries")}</p>
          </Card>
          <Card className="bg-success text-center p-4">
            <p className="text-2xl font-bold text-success-foreground">
              {avgVocalizations()}
            </p>
            <p className="text-sm text-success-foreground">{t("translations:avg_vocalizations")}</p>
          </Card>
        </div>

        {/* Analytics List */}
        {analytics.length === 0 ? (
          <Card className="card-playful">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("translations:no_analytics_yet")}</h3>
              <p className="text-muted-foreground">{t("translations:no_analytics_desc")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {analytics.map((analytic, idx) => (
              <Card
                key={analytic.id}
                className="card-playful hover:scale-102 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        {formatDate(analytic.created_at)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t("translations:session_by", {
                          child: analytic.child,
                          number: idx + 1,
                        })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {analytic.session_duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">
                          {analytic.topics_detected &&
                            analytic.topics_detected.length > 0
                              ? `${analytic.topics_detected.length} topics`
                              : t("translations:topics_label") + " " + t("translations:no_analytics_yet")}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>
                          {t("translations:vocalizations_label")} {analytic.child_vocalizations ?? 0}
                      </div>
                      <div>
                          {t("translations:ai_responses_label")} {analytic.assistant_responses ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-3 text-sm text-muted-foreground space-y-2">
                    <div>
                        <strong>{t("translations:avg_utterance_label")}</strong>{" "}
                        {analytic.avg_child_utterance_length != null
                          ? analytic.avg_child_utterance_length.toFixed(1) +
                            " words"
                          : "—"}
                    </div>
                      <div>
                        <strong>{t("translations:unique_words_label")}</strong>{" "}
                        {analytic.unique_child_words ?? 0}
                      </div>
                      <div>
                        <strong>{t("translations:encouragements_label")}</strong>{" "}
                        {analytic.encouragements_given ?? 0}
                      </div>
                      <div>
                        <strong>{t("translations:child_ai_ratio_label")}</strong>{" "}
                        {analytic.child_to_ai_ratio != null
                          ? analytic.child_to_ai_ratio.toFixed(2)
                          : "—"}
                      </div>
                    {analytic.best_utterance &&
                      analytic.topics_detected.length > 0 && (
                        <div>
                            <strong>{t("translations:best_utterance_label")}</strong>{" "}
                            {Array.isArray(analytic.best_utterance)
                              ? analytic.best_utterance.join(", ")
                              : String(analytic.best_utterance)}
                        </div>
                      )}
                    {analytic.conversation_summary && (
                      <div>
                          <strong>{t("translations:summary_label")}</strong>{" "}
                          {analytic.conversation_summary}
                      </div>
                    )}
                    {analytic.topics_detected &&
                      analytic.topics_detected.length > 0 && (
                        <div>
                            <strong>{t("translations:topics_label")}</strong>{" "}
                            {analytic.topics_detected.join(", ")}
                        </div>
                      )}
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
