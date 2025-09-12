import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Star,
  Download,
  MessageCircle,
  Brain,
  Users,
  Award,
  ChevronDown,
  Database,
  Server,
  Globe,
  Shield,
  Code,
  Cpu,
  Monitor,
  Cloud,
  GitBranch,
  Settings,
  ArrowRight,
  ArrowDown,
  Smartphone,
  User,
} from "lucide-react";

const LandingPage = () => {
  const [language, setLanguage] = useState("fa");
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const workflowRef = useRef(null);

  // Load GSAP animations
  useEffect(() => {
    // Add Vazirmatn font
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // GSAP CDN
    const gsapScript = document.createElement("script");
    gsapScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    gsapScript.onload = () => {
      // Hero animations
      window.gsap.from(".hero-title", {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: "power3.out",
      });

      window.gsap.from(".hero-subtitle", {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 0.3,
        ease: "power3.out",
      });

      window.gsap.from(".hero-cta", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        delay: 0.6,
        ease: "power3.out",
      });

      // Features animation
      window.gsap.from(".feature-card", {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
      });

      // Workflow animation
      window.gsap.from(".workflow-item", {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: workflowRef.current,
          start: "top 80%",
        },
      });
    };
    document.head.appendChild(gsapScript);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(gsapScript);
    };
  }, []);

  const translations = {
    fa: {
      dashboard: "داشبورد",
      hero: {
        title: "بهترین دستیار هوش مصنوعی برای توسعه زبان کودکان",
        subtitle:
          "با استفاده از فناوری پیشرفته هوش مصنوعی، کودک شما با یک دستیار دوستانه گفتگو می‌کند و مهارت‌های زبانی خود را بهبود می‌بخشد",
        cta: "همین حالا شروع کنید",
        demo: "مشاهده دمو",
      },
      features: {
        title: "ویژگی‌های منحصر به فرد",
        subtitle: "تکنولوژی‌های پیشرفته برای بهترین تجربه یادگیری",
        items: [
          {
            title: "دستیار هوش مصنوعی واقعی",
            description:
              "آواتار زنده با قابلیت حرکت صورت و بدن، گفتار طبیعی و تعامل انسان‌گونه",
          },
          {
            title: "پردازش زبان پیشرفته",
            description:
              "استفاده از GPT-8 Nano برای درک بهتر و پاسخ‌های هوشمندانه به کودکان",
          },
          {
            title: "صدای گرم و دوستانه",
            description:
              "فناوری ElevenLabs برای تولید صدای طبیعی و جذاب برای کودکان",
          },
          {
            title: "تشخیص صدای دقیق",
            description:
              "سیستم Cartesia STT با کیفیت بالا برای درک بهتر صحبت‌های کودک",
          },
        ],
      },
      workflow: {
        title: "معماری سیستم پیشرفته",
        subtitle: "نگاهی به فناوری‌های پشت صحنه اپلیکیشن ما",
        items: [
          {
            title: "فرانت‌اند",
            description: "React + LiveKit SDK",
            details: "رابط کاربری تعاملی با React Router",
          },
          {
            title: "بک‌اند",
            description: "Django + PostgreSQL",
            details: "مدیریت کاربران، جلسات و تاریخچه",
          },
          {
            title: "هوش مصنوعی",
            description: "GPT-8 Nano + Tavus Avatar",
            details: "دستیار هوشمند با آواتار زنده",
          },
          {
            title: "LiveKit Cloud",
            description: "ارتباط Real-time",
            details: "اتصال gRPC بین کاربر و دستیار",
          },
          {
            title: "امنیت",
            description: "Nginx + HTTPS",
            details: "ارتباط امن و سریع",
          },
          {
            title: "استقرار",
            description: "Docker + Hetzner",
            details: "سرور قدرتمند و پایدار",
          },
        ],
      },
      testimonials: {
        title: "نظرات والدین و معلمان",
        items: [
          {
            name: "مریم احمدی",
            role: "مادر",
            text: "فرزندم در عرض یک ماه پیشرفت فوق‌العاده‌ای داشته. دستیار هوش مصنوعی واقعاً جذاب و مفید است.",
          },
          {
            name: "احمد رضایی",
            role: "معلم پیش‌دبستانی",
            text: "این ابزار انقلابی در آموزش زبان است. کودکان با علاقه و شوق استفاده می‌کنند.",
          },
        ],
      },
      cta: {
        title: "آماده شروع هستید؟",
        subtitle: "همین امروز سفر یادگیری کودک خود را آغاز کنید",
        button: "دانلود رایگان",
      },
    },
    en: {
      dashboard: "Dashboard",
      hero: {
        title: "The Best AI Assistant for Children's Language Development",
        subtitle:
          "Using advanced AI technology, your child converses with a friendly assistant and improves their language skills",
        cta: "Get Started Now",
        demo: "Watch Demo",
      },
      features: {
        title: "Unique Features",
        subtitle: "Advanced technologies for the best learning experience",
        items: [
          {
            title: "Real AI Assistant",
            description:
              "Live avatar with facial and body movements, natural speech and human-like interaction",
          },
          {
            title: "Advanced Language Processing",
            description:
              "Using GPT-8 Nano for better understanding and intelligent responses to children",
          },
          {
            title: "Warm and Friendly Voice",
            description:
              "ElevenLabs technology for generating natural and engaging voice for children",
          },
          {
            title: "Accurate Voice Recognition",
            description:
              "High-quality Cartesia STT system for better understanding of children's speech",
          },
        ],
      },
      workflow: {
        title: "Advanced System Architecture",
        subtitle: "A look at the technologies behind our application",
        items: [
          {
            title: "Frontend",
            description: "React + LiveKit SDK",
            details: "Interactive UI with React Router",
          },
          {
            title: "Backend",
            description: "Django + PostgreSQL",
            details: "User management, sessions and history",
          },
          {
            title: "AI Agent",
            description: "GPT-8 Nano + Tavus Avatar",
            details: "Smart assistant with live avatar",
          },
          {
            title: "LiveKit Cloud",
            description: "Real-time Communication",
            details: "gRPC connection between user and agent",
          },
          {
            title: "Security",
            description: "Nginx + HTTPS",
            details: "Secure and fast communication",
          },
          {
            title: "Deployment",
            description: "Docker + Hetzner",
            details: "Powerful and stable server",
          },
        ],
      },
      testimonials: {
        title: "Parents and Teachers Reviews",
        items: [
          {
            name: "Sarah Johnson",
            role: "Mother",
            text: "My child has made incredible progress in just one month. The AI assistant is truly engaging and helpful.",
          },
          {
            name: "Michael Brown",
            role: "Preschool Teacher",
            text: "This is a revolutionary tool in language education. Children use it with interest and enthusiasm.",
          },
        ],
      },
      cta: {
        title: "Ready to Get Started?",
        subtitle: "Begin your child's learning journey today",
        button: "Free Download",
      },
    },
  };

  const t = translations[language];
  const isRTL = language === "fa";

  const workflowConnections = [
    { from: 0, to: 1 }, // Frontend to Backend
    { from: 1, to: 2 }, // Backend to AI
    { from: 2, to: 3 }, // AI to LiveKit
    { from: 3, to: 4 }, // LiveKit to Security
    { from: 4, to: 5 }, // Security to Deployment
  ];

  const workflowIcons = [Monitor, Database, Cpu, Cloud, Shield, Server];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${
        isRTL ? "rtl font-vazirmatn" : "ltr"
      }`}
    >
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Learning
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === "fa" ? "en" : "fa")}
              className="px-3 py-2 text-sm border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              {language === "fa" ? "EN" : "فا"}
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
              {t.dashboard}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            {t.hero.title}
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>{t.hero.cta}</span>
            </button>
            <button className="px-8 py-4 border-2 border-purple-200 text-purple-600 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>{t.hero.demo}</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI Character Showcase */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-purple-100">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                دستیار هوشمند آریا
              </h3>
              <p className="text-gray-600 mb-4">
                آواتار زنده با قابلیت حرکت و گفتگوی طبیعی
              </p>
              <div className="flex justify-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div
                  className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Workflow */}
      <section ref={workflowRef} className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {t.workflow.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.workflow.subtitle}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.workflow.items.map((item, index) => {
                const IconComponent = workflowIcons[index];
                return (
                  <div key={index} className="workflow-item relative">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 mx-auto">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                        {item.title}
                      </h3>
                      <p className="text-purple-600 font-medium text-center mb-2">
                        {item.description}
                      </p>
                      <p className="text-gray-600 text-sm text-center">
                        {item.details}
                      </p>

                      {/* Connection arrows */}
                      {index < t.workflow.items.length - 1 && (
                        <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                          <ArrowRight className="w-6 h-6 text-purple-300" />
                        </div>
                      )}
                      {index < t.workflow.items.length - 1 &&
                        index % 3 === 2 && (
                          <div className="hidden lg:block absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                            <ArrowDown className="w-6 h-6 text-purple-300" />
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        ref={featuresRef}
        className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  {index === 0 && <User className="w-6 h-6 text-white" />}
                  {index === 1 && <Brain className="w-6 h-6 text-white" />}
                  {index === 2 && (
                    <MessageCircle className="w-6 h-6 text-white" />
                  )}
                  {index === 3 && <Settings className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {t.testimonials.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {t.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className={`${isRTL ? "mr-3" : "ml-3"}`}>
                    <div className="font-semibold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center space-x-2 mx-auto">
            <Download className="w-5 h-5" />
            <span>{t.cta.button}</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">AI Learning</span>
          </div>
          <p className="text-gray-400">
            {language === "fa" ? "همه حقوق محفوظ است." : "All rights reserved."}
          </p>
        </div>
      </footer>

      <style jsx>{`
        .font-vazirmatn {
          font-family: "Vazirmatn", sans-serif;
        }
        .rtl {
          direction: rtl;
        }
        .ltr {
          direction: ltr;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
