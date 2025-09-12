import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(newLang);
  };

  const isRTL = i18n.language === "fa";

  return (
    <div className="fixed top-6 right-6 z-50">
      <Button
        onClick={toggleLanguage}
        variant="outline"
        className="bg-white/90 backdrop-blur-sm border-purple-200 hover:bg-purple-50 shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {i18n.language === "en" ? "🇮🇷" : "🇺🇸"}
          </span>
          <span className="font-medium">
            {i18n.language === "en" ? "فارسی" : "English"}
          </span>
        </div>
      </Button>

      {/* RTL Style indicator */}
      <style jsx global>{`
        html[dir="rtl"] {
          direction: rtl;
        }
        html[dir="rtl"] .rtl-flip {
          transform: scaleX(-1);
        }
      `}</style>

      {/* Apply RTL to document */}
      {typeof document !== "undefined" &&
        document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr")}
    </div>
  );
}
