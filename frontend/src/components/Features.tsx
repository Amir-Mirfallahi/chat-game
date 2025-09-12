import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initFeatureAnimations } from "@/lib/animations";
import {
  Bot,
  MessageCircle,
  Brain,
  Gamepad2,
  BarChart3,
  Shield,
  Sparkles,
  User,
  Handshake,
  Rocket,
} from "lucide-react";

export default function Features() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    initFeatureAnimations();
  }, []);

  const features = [
    {
      icon: Bot,
      title: t("features.feature1.title"),
      description: t("features.feature1.description"),
      highlight: t("features.feature1.highlight"),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MessageCircle,
      title: t("features.feature2.title"),
      description: t("features.feature2.description"),
      highlight: t("features.feature2.highlight"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: t("features.feature3.title"),
      description: t("features.feature3.description"),
      highlight: t("features.feature3.highlight"),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Gamepad2,
      title: t("features.feature4.title"),
      description: t("features.feature4.description"),
      highlight: t("features.feature4.highlight"),
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: t("features.feature5.title"),
      description: t("features.feature5.description"),
      highlight: t("features.feature5.highlight"),
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: t("features.feature6.title"),
      description: t("features.feature6.description"),
      highlight: t("features.feature6.highlight"),
      color: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 animate-on-scroll ${
            isRTL ? "text-right" : "text-left"
          } md:text-center`}
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {t("features.badge")}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("features.title1")}
            </span>
            <br />
            <span className="text-gray-800">{t("features.title2")}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="feature-card group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <CardHeader className="relative">
                  <div
                    className={`flex items-center justify-between mb-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle
                    className={`text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <p
                    className={`text-gray-600 leading-relaxed ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works Section */}
        <div className="mt-24 animate-on-scroll">
          <div
            className={`text-center mb-12 ${
              isRTL ? "text-right" : "text-left"
            } md:text-center`}
          >
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-gray-800">{t("features.how_title1")}</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                {t("features.how_title2")}
              </span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: t("features.step1.title"),
                description: t("features.step1.description"),
                icon: User,
              },
              {
                step: "02",
                title: t("features.step2.title"),
                description: t("features.step2.description"),
                icon: Handshake,
              },
              {
                step: "03",
                title: t("features.step3.title"),
                description: t("features.step3.description"),
                icon: Rocket,
              },
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className={`text-center group ${
                    isRTL ? "text-right" : "text-left"
                  } md:text-center`}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div
                      className={`absolute -top-2 ${
                        isRTL ? "-left-2" : "-right-2"
                      } w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {step.step}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {step.title}
                  </h4>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
