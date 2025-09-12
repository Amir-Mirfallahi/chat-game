import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initScrollAnimations } from "@/lib/animations";
import {
  Monitor,
  Globe,
  Database,
  Cloud,
  Bot,
  Container,
  Server,
  ArrowRight,
  ArrowDown,
  Github,
  Zap,
  Shield,
  Users,
} from "lucide-react";

export default function Workflow() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 animate-on-scroll ${
            isRTL ? "text-right" : "text-left"
          } md:text-center`}
        >
          <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            {isRTL ? "معماری سیستم" : "System Architecture"}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-800">
              {isRTL ? "جریان کار" : "Application"}
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isRTL ? "برنامه ما" : "Workflow"}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {isRTL
              ? "نمایش کامل معماری و ساختار پیچیده سیستم هوش مصنوعی ما که با فناوری‌های پیشرفته ساخته شده است"
              : "A comprehensive view of our AI system architecture built with cutting-edge technologies and seamless integrations"}
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="animate-on-scroll">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-2xl border border-gray-100 overflow-hidden relative">
            {/* Step 1: User Interaction */}
            <div className="mb-12">
              <h3
                className={`text-2xl font-bold text-gray-800 mb-8 flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Users
                  className={`w-6 h-6 ${isRTL ? "ml-3" : "mr-3"} text-blue-500`}
                />
                {isRTL ? "مرحله ۱: تعامل کاربر" : "Step 1: User Interaction"}
              </h3>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-blue-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "فرانت‌اند (React)" : "Frontend (React)"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL
                        ? "رابط کاربری تعاملی با LiveKit SDK"
                        : "Interactive user interface with LiveKit SDK"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        React
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        LiveKit
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        TypeScript
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Step 2: Security & Routing */}
            <div className="mb-12">
              <h3
                className={`text-2xl font-bold text-gray-800 mb-8 flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Shield
                  className={`w-6 h-6 ${
                    isRTL ? "ml-3" : "mr-3"
                  } text-green-500`}
                />
                {isRTL
                  ? "مرحله ۲: امنیت و مسیریابی"
                  : "Step 2: Security & Routing"}
              </h3>

              <div className="grid md:grid-cols-3 gap-8 items-center">
                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-green-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "سرور Nginx" : "Nginx Server"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL
                        ? "پروکسی معکوس و SSL termination"
                        : "Reverse proxy & SSL termination"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        HTTPS
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        SSL
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-green-500 animate-pulse" />
                </div>

                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-purple-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "بک‌اند (Django)" : "Backend (Django)"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL
                        ? "API، احراز هویت و مدیریت داده‌ها"
                        : "API, authentication & data management"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Django
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PostgreSQL
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Celery
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 3: Real-time Communication */}
            <div className="mb-12">
              <h3
                className={`text-2xl font-bold text-gray-800 mb-8 flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Cloud
                  className={`w-6 h-6 ${
                    isRTL ? "ml-3" : "mr-3"
                  } text-orange-500`}
                />
                {isRTL
                  ? "مرحله ۳: ارتباط لحظه‌ای"
                  : "Step 3: Real-time Communication"}
              </h3>

              <div className="grid md:grid-cols-3 gap-8 items-center">
                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-orange-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Cloud className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "LiveKit Cloud" : "LiveKit Cloud"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL
                        ? "مدیریت اتصالات WebRTC و gRPC"
                        : "WebRTC & gRPC connection management"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        WebRTC
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        gRPC
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col items-center">
                  <ArrowDown className="w-8 h-8 text-orange-500 animate-bounce" />
                  <span className="text-sm text-gray-500 mt-2">
                    {isRTL ? "اتصال مستقیم" : "Direct Connection"}
                  </span>
                </div>

                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-indigo-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "عامل هوش مصنوعی" : "AI Agent"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL
                        ? "پردازش گفتار، متن و تصویر"
                        : "Speech, text & video processing"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        GPT-4
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Cartesia
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        ElevenLabs
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Tavus
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step 4: Deployment & Infrastructure */}
            <div className="mb-8">
              <h3
                className={`text-2xl font-bold text-gray-800 mb-8 flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Container
                  className={`w-6 h-6 ${isRTL ? "ml-3" : "mr-3"} text-teal-500`}
                />
                {isRTL
                  ? "مرحله ۴: استقرار و زیرساخت"
                  : "Step 4: Deployment & Infrastructure"}
              </h3>

              <div className="grid md:grid-cols-3 gap-8 items-center">
                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-teal-100 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Container className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "Docker" : "Docker"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL
                        ? "کانتینرسازی و Docker Compose"
                        : "Containerization & Docker Compose"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Docker
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Compose
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-teal-500 animate-pulse" />
                </div>

                <Card className="group hover:shadow-xl transition-all duration-500 border-2 border-gray-200 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center ${
                        isRTL ? "flex-row-reverse" : ""
                      } mb-2`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Server className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle
                        className={`text-lg font-bold text-gray-800 ${
                          isRTL ? "mr-3 text-right" : "ml-3"
                        }`}
                      >
                        {isRTL ? "سرور Hetzner" : "Hetzner Server"}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-sm text-gray-600 mb-3 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {isRTL ? "سرور مجازی تولید" : "Production VPS hosting"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        VPS
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Linux
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Data Flow Summary */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4
                className={`text-lg font-semibold text-gray-800 mb-6 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {isRTL ? "خلاصه جریان داده‌ها" : "Data Flow Summary"}
              </h4>
              <div
                className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    {isRTL ? "کاربر → فرانت‌اند" : "User → Frontend"}
                  </span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    {isRTL
                      ? "فرانت‌اند → Nginx → بک‌اند"
                      : "Frontend → Nginx → Backend"}
                  </span>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    {isRTL
                      ? "فرانت‌اند → LiveKit → عامل"
                      : "Frontend → LiveKit → Agent"}
                  </span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    {isRTL
                      ? "عامل → پاسخ صوتی/تصویری"
                      : "Agent → Audio/Video Response"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Repository Link */}
        <div className="mt-12 text-center animate-on-scroll">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
            <Github className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-2xl font-bold mb-4">
              {isRTL ? "کد منبع در GitHub" : "Open Source on GitHub"}
            </h3>
            <p className="text-gray-300 mb-6">
              {isRTL
                ? "کد کامل این پروژه در مخزن GitHub ما در دسترس است"
                : "The complete source code for this project is available on our GitHub repository"}
            </p>
            <a
              href="https://github.com/Amir-Mirfallahi/chat-game.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              <Github className="w-5 h-5 mr-2" />
              {isRTL ? "مشاهده کد منبع" : "View Source Code"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
