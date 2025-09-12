import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function CallToAction() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "fa";
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center ${
            isRTL ? "text-right" : "text-left"
          } md:text-center`}
        >
          <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-2 text-lg">
            🚀 {isRTL ? "پیشنهاد محدود" : "Limited Time Offer"}
          </Badge>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {isRTL ? "به فرزندتان هدیه" : "Give Your Child the Gift of"}
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {isRTL ? "ارتباط با اعتماد بدهید" : "Confident Communication"}
            </span>
          </h2>

          <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            {isRTL
              ? "به هزاران خانواده‌ای بپیوندید که سفر زبانی فرزندشان را متحول کرده‌اند. آزمایش رایگان خود را امروز شروع کنید و شکوفایی فرزندتان را با اعتماد ببینید."
              : "Join thousands of families who have transformed their child's language journey. Start your free trial today and watch your child blossom with confidence."}
          </p>

          {/* Single CTA Button */}
          <div className="mb-12">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-2xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              {isRTL ? "🎯 شروع آزمایش رایگان" : "🎯 Start Free Trial"}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap justify-center items-center gap-8 mb-8 text-white/80 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="flex items-center">
              <span className={`text-2xl ${isRTL ? "ml-2" : "mr-2"}`}>🔒</span>
              <span className="font-medium">
                {isRTL ? "منطبق با COPPA" : "COPPA Compliant"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`text-2xl ${isRTL ? "ml-2" : "mr-2"}`}>🏆</span>
              <span className="font-medium">
                {isRTL ? "برنده جایزه" : "Award Winning"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`text-2xl ${isRTL ? "ml-2" : "mr-2"}`}>🧠</span>
              <span className="font-medium">
                {isRTL ? "مبتنی بر تحقیق" : "Research Backed"}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`text-2xl ${isRTL ? "ml-2" : "mr-2"}`}>💝</span>
              <span className="font-medium">
                {isRTL ? "ضمانت ۳۰ روزه" : "30-Day Guarantee"}
              </span>
            </div>
          </div>

          <p className="text-white/70 text-sm">
            {isRTL
              ? "✨ بدون هزینه راه‌اندازی • لغو هر زمان • پشتیبانی ۲۴/۷ • امن برای کودکان"
              : "✨ No setup fees • Cancel anytime • 24/7 support • Safe for children"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 border-t border-white/20 pt-12">
        <div className="container mx-auto px-6">
          <div
            className={`grid md:grid-cols-4 gap-8 text-white/80 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div>
              <h4 className="font-bold text-white mb-4">
                {isRTL ? "محصول" : "Product"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "ویژگی‌ها" : "Features"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "نمونه" : "Demo"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "تحقیق" : "Research"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "جریان کار" : "Workflow"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">
                {isRTL ? "پشتیبانی" : "Support"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "مرکز راهنما" : "Help Center"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "تماس با ما" : "Contact Us"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "راهنمای والدین" : "Parent Guide"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "ایمنی" : "Safety"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">
                {isRTL ? "شرکت" : "Company"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "درباره ما" : "About Us"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "مشاغل" : "Careers"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "مطبوعات" : "Press"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "شرکای تجاری" : "Partners"}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">
                {isRTL ? "قانونی" : "Legal"}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "سیاست حریم خصوصی" : "Privacy Policy"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "شرایط خدمات" : "Terms of Service"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "انطباق COPPA" : "COPPA Compliance"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {isRTL ? "امنیت داده" : "Data Security"}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`text-center mt-12 pt-8 border-t border-white/20 text-white/60 ${
              isRTL ? "text-right" : "text-left"
            } md:text-center`}
          >
            <p>
              {isRTL
                ? "© ۲۰۲۴ دوست زبان هوش مصنوعی. تمام حقوق محفوظ است. با ❤️ برای کودکان و خانواده‌ها ساخته شده."
                : "© 2024 AI Language Friend. All rights reserved. Made with ❤️ for children and families."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
