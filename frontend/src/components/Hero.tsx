import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initHeroAnimations, initAIAgentAnimation } from "@/lib/animations";
import { Brain, Play, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    initHeroAnimations();
    initAIAgentAnimation();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Button className="sticky top-10 right-5 rounded-lg bg-orange-400">
        {isAuthenticated ? "داشبورد" : "ورود/ثبت نام"}
      </Button>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center ${
            isRTL ? "lg:grid-cols-2" : ""
          }`}
        >
          {/* Left Content */}
          <div className={`space-y-8 ${isRTL ? "text-right" : "text-left"}`}>
            <Badge className="hero-title bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm font-medium">
              <Brain className="w-4 h-4 mr-2" />
              {t("hero.badge")}
            </Badge>

            <h1 className="hero-title text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                {t("hero.title1")}
              </span>
              <br />
              <span className="text-gray-800">{t("hero.title2")}</span>
            </h1>

            <p className="hero-subtitle text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
              {t("hero.subtitle")}{" "}
              <span className="font-semibold text-purple-600">
                {t("hero.subtitle_natural")}
              </span>
              ،{" "}
              <span className="font-semibold text-pink-600">
                {t("hero.subtitle_facial")}
              </span>{" "}
              و{" "}
              <span className="font-semibold text-blue-600">
                {t("hero.subtitle_interactive")}
              </span>
              .
            </p>

            <div className="hero-cta space-y-4">
              <div
                className={`flex flex-col sm:flex-row gap-4 ${
                  isRTL ? "sm:flex-row-reverse" : ""
                }`}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t("hero.cta_trial")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t("hero.cta_demo")}
                </Button>
              </div>
              <p className="text-sm text-gray-500">{t("hero.no_credit")}</p>
            </div>

            <div
              className={`flex items-center space-x-8 pt-4 ${
                isRTL ? "space-x-reverse" : ""
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {t("hero.stat1_number")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("hero.stat1_label")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {t("hero.stat2_number")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("hero.stat2_label")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {t("hero.stat3_number")}
                </div>
                <div className="text-sm text-gray-500">
                  {t("hero.stat3_label")}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - AI Agent Preview */}
          <div
            className={`ai-agent-preview relative ${
              isRTL ? "order-first lg:order-last" : ""
            }`}
          >
            <div className="ai-agent-float relative">
              {/* Main AI Agent Container */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
                {/* AI Agent Face */}
                <div className="ai-pulse w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-full flex items-center justify-center relative overflow-hidden">
                  <div className="w-44 h-44 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center">
                    {/* Eyes */}
                    <div className="absolute top-16 left-16 w-6 h-6 bg-white rounded-full">
                      <div className="w-4 h-4 bg-gray-800 rounded-full mt-1 ml-1"></div>
                    </div>
                    <div className="absolute top-16 right-16 w-6 h-6 bg-white rounded-full">
                      <div className="w-4 h-4 bg-gray-800 rounded-full mt-1 ml-1"></div>
                    </div>
                    {/* Smile */}
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-8 border-b-4 border-white rounded-full"></div>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300"></div>
                  <div className="absolute top-1/2 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
                </div>

                {/* Speech Bubble */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-100 to-pink-100 rotate-45"></div>
                  <p
                    className={`text-center text-gray-700 font-medium ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    "{t("hero.ai_speech")}"
                  </p>
                </div>

                {/* Interactive Elements */}
                <div className="flex justify-center space-x-4 mt-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xl animate-pulse">
                    <Play className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xl animate-pulse delay-200">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl animate-pulse delay-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                Live AI
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce delay-300">
                Safe & Secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
