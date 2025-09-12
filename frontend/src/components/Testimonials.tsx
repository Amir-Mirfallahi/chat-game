import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initScrollAnimations } from "@/lib/animations";

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    initScrollAnimations();
  }, []);

  const testimonials = [
    {
      name: t("testimonials.testimonial1.name"),
      role: t("testimonials.testimonial1.role"),
      content: t("testimonials.testimonial1.content"),
      rating: 5,
      avatar: "SJ",
      highlight: t("testimonials.testimonial1.highlight"),
    },
    {
      name: t("testimonials.testimonial2.name"),
      role: t("testimonials.testimonial2.role"),
      content: t("testimonials.testimonial2.content"),
      rating: 5,
      avatar: "MC",
      highlight: t("testimonials.testimonial2.highlight"),
    },
    {
      name: t("testimonials.testimonial3.name"),
      role: t("testimonials.testimonial3.role"),
      content: t("testimonials.testimonial3.content"),
      rating: 5,
      avatar: "LR",
      highlight: t("testimonials.testimonial3.highlight"),
    },
    {
      name: t("testimonials.testimonial4.name"),
      role: t("testimonials.testimonial4.role"),
      content: t("testimonials.testimonial4.content"),
      rating: 5,
      avatar: "JT",
      highlight: t("testimonials.testimonial4.highlight"),
    },
    {
      name: t("testimonials.testimonial5.name"),
      role: t("testimonials.testimonial5.role"),
      content: t("testimonials.testimonial5.content"),
      rating: 5,
      avatar: "MG",
      highlight: t("testimonials.testimonial5.highlight"),
    },
    {
      name: t("testimonials.testimonial6.name"),
      role: t("testimonials.testimonial6.role"),
      content: t("testimonials.testimonial6.content"),
      rating: 5,
      avatar: "AW",
      highlight: t("testimonials.testimonial6.highlight"),
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 animate-on-scroll ${
            isRTL ? "text-right" : "text-left"
          } md:text-center`}
        >
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
            {t("testimonials.badge")}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-800">{t("testimonials.title1")}</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("testimonials.title2")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("testimonials.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="animate-on-scroll group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardContent className="p-6 relative">
                <div
                  className={`flex items-center mb-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className={`w-12 h-12 ${isRTL ? "ml-4" : "mr-4"}`}>
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold text-gray-800 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className={`text-sm text-gray-600 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.highlight}
                  </Badge>
                </div>

                <div
                  className={`flex mb-4 ${
                    isRTL ? "justify-end" : "justify-start"
                  }`}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>

                <blockquote
                  className={`text-gray-700 italic leading-relaxed ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-20 animate-on-scroll">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("hero.stat2_number")}
                </div>
                <div className="text-gray-600 font-medium">
                  {t("testimonials.stats.satisfaction")}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t("testimonials.stats.satisfaction_desc")}
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  ۸۷٪
                </div>
                <div className="text-gray-600 font-medium">
                  {t("testimonials.stats.improvement")}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t("testimonials.stats.improvement_desc")}
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("hero.stat1_number")}
                </div>
                <div className="text-gray-600 font-medium">
                  {t("testimonials.stats.children")}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t("testimonials.stats.children_desc")}
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {t("hero.stat3_number")}
                </div>
                <div className="text-gray-600 font-medium">
                  {t("testimonials.stats.research")}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t("testimonials.stats.research_desc")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
