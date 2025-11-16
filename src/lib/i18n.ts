import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Hero Section
      hero: {
        badge: "🧠 Research-Backed AI Technology",
        title1: "Meet Your Child's",
        title2: "AI Language Friend",
        subtitle: "Our revolutionary AI companion helps children with Late Language Emergence through",
        subtitle_natural: "natural conversation",
        subtitle_facial: "facial expressions",
        subtitle_interactive: "interactive play",
        cta_trial: "Start Free Trial",
        cta_demo: "Watch Demo",
        no_credit: "✨ No credit card required • 7-day free trial",
        stat1_number: "10,000+",
        stat1_label: "Children Helped",
        stat2_number: "94%",
        stat2_label: "Parent Satisfaction",
        stat3_number: "50+",
        stat3_label: "Research Studies",
        ai_speech: "Hi there! I'm excited to chat and play with you today! 🌟"
      },
      // Features Section
      features: {
        badge: "✨ Revolutionary Technology",
        title1: "Why Our AI Agent",
        title2: "Changes Everything",
        subtitle: "Experience the future of language development with our groundbreaking AI companion that understands, responds, and grows with your child.",
        feature1: {
          title: "Human-Like AI Agent",
          description: "Our AI companion features realistic facial expressions, natural body movements, and emotional intelligence designed specifically for children.",
          highlight: "Facial Recognition"
        },
        feature2: {
          title: "Natural Conversation",
          description: "Advanced language processing enables fluid, age-appropriate conversations that adapt to your child's communication level and interests.",
          highlight: "Adaptive Learning"
        },
        feature3: {
          title: "LLE Specialized Support",
          description: "Research-backed techniques specifically designed for Late Language Emergence, with personalized activities and progress tracking.",
          highlight: "Evidence-Based"
        },
        feature4: {
          title: "Interactive Games",
          description: "Engaging activities and games that make language learning fun while building vocabulary, pronunciation, and communication skills.",
          highlight: "Gamified Learning"
        },
        feature5: {
          title: "Progress Tracking",
          description: "Detailed analytics and reports help parents and educators monitor language development and celebrate milestones.",
          highlight: "Real-time Data"
        },
        feature6: {
          title: "Safe Environment",
          description: "COPPA-compliant platform with advanced safety measures, parental controls, and secure data protection for peace of mind.",
          highlight: "Privacy First"
        },
        how_title1: "How It Works in",
        how_title2: "3 Simple Steps",
        step1: {
          title: "Create Profile",
          description: "Set up your child's profile with age, interests, and language development goals."
        },
        step2: {
          title: "Meet Your AI Friend",
          description: "Your child is introduced to their personalized AI companion who adapts to their personality."
        },
        step3: {
          title: "Start Learning",
          description: "Begin interactive conversations, games, and activities tailored to your child's needs."
        }
      },
      // Testimonials Section
      testimonials: {
        badge: "💝 Real Stories, Real Results",
        title1: "Transforming Lives",
        title2: "One Conversation at a Time",
        subtitle: "Discover how our AI companion is helping thousands of children overcome language challenges and build confidence in communication.",
        testimonial1: {
          name: "Sarah Johnson",
          role: "Parent of Emma (4 years old)",
          content: "Emma was barely speaking at 3, but after just 2 months with the AI companion, she's having full conversations! The progress has been incredible.",
          highlight: "Amazing Progress"
        },
        testimonial2: {
          name: "Dr. Michael Chen",
          role: "Speech-Language Pathologist",
          content: "As a professional, I'm impressed by the research-backed approach. The AI's ability to adapt to each child's needs is revolutionary for LLE treatment.",
          highlight: "Professional Approved"
        },
        testimonial3: {
          name: "Lisa Rodriguez",
          role: "Mother of twins (5 years old)",
          content: "Both my twins had different language challenges. The AI created unique approaches for each child. They now love talking and can't wait for their daily sessions!",
          highlight: "Personalized Care"
        },
        testimonial4: {
          name: "James Thompson",
          role: "Elementary School Teacher",
          content: "I've recommended this to several parents in my class. The improvement in children's communication skills and confidence has been remarkable.",
          highlight: "Educator Recommended"
        },
        testimonial5: {
          name: "Maria Garcia",
          role: "Parent of Alex (6 years old)",
          content: "Alex was so shy and rarely spoke. Now he initiates conversations with family and friends. The AI friend gave him the confidence he needed.",
          highlight: "Confidence Boost"
        },
        testimonial6: {
          name: "Dr. Amanda White",
          role: "Child Development Specialist",
          content: "The facial expressions and natural interactions create an environment where children feel safe to practice. It's like having a patient, understanding friend.",
          highlight: "Expert Endorsed"
        },
        stats: {
          satisfaction: "Parent Satisfaction",
          satisfaction_desc: "Based on 2,500+ reviews",
          improvement: "Language Improvement",
          improvement_desc: "Within first 3 months",
          children: "Children Helped",
          children_desc: "Across 50+ countries",
          research: "Research Studies",
          research_desc: "Supporting our approach"
        }
      },
      // Call to Action Section
      cta: {
        badge: "🚀 Limited Time Offer",
        title1: "Give Your Child the Gift of",
        title2: "Confident Communication",
        subtitle: "Join thousands of families who have transformed their child's language journey. Start your free trial today and watch your child blossom with confidence.",
        free_trial: {
          title: "Free Trial",
          price: "$0",
          description: "7 days • Full access • No commitment",
          button: "Start Free Trial",
          feature1: "Full AI companion access",
          feature2: "Progress tracking",
          feature3: "Parent dashboard"
        },
        premium: {
          title: "Premium Plan",
          price: "$29",
          period: "per month",
          description: "Everything + advanced features",
          button: "Get Premium",
          popular: "Most Popular",
          feature1: "Advanced AI personalities",
          feature2: "Detailed analytics",
          feature3: "Priority support"
        },
        trust: {
          coppa: "COPPA Compliant",
          award: "Award Winning",
          research: "Research Backed",
          guarantee: "30-Day Guarantee"
        },
        footer_note: "✨ No setup fees • Cancel anytime • 24/7 support • Safe for children"
      },
      // Navigation
      nav: {
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        demo: "Demo",
        research: "Research",
        support: "Support",
        help_center: "Help Center",
        contact: "Contact Us",
        parent_guide: "Parent Guide",
        safety: "Safety",
        company: "Company",
        about: "About Us",
        careers: "Careers",
        press: "Press",
        partners: "Partners",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        coppa_compliance: "COPPA Compliance",
        data_security: "Data Security"
      },
      footer: "© 2024 AI Language Friend. All rights reserved. Made with ❤️ for children and families."
    }
  },
  fa: {
    translation: {
      // Hero Section
      hero: {
        badge: "🧠 فناوری هوش مصنوعی مبتنی بر تحقیق",
        title1: "با دوست زبان",
        title2: "هوش مصنوعی فرزندتان آشنا شوید",
        subtitle: "همراه انقلابی هوش مصنوعی ما به کودکان با تأخیر در ظهور زبان از طریق",
        subtitle_natural: "گفتگوی طبیعی",
        subtitle_facial: "حالات چهره",
        subtitle_interactive: "بازی تعاملی",
        cta_trial: "شروع آزمایش رایگان",
        cta_demo: "مشاهده نمونه",
        no_credit: "✨ نیازی به کارت اعتباری نیست • ۷ روز آزمایش رایگان",
        stat1_number: "۱۰,۰۰۰+",
        stat1_label: "کودک یاری شده",
        stat2_number: "۹۴٪",
        stat2_label: "رضایت والدین",
        stat3_number: "۵۰+",
        stat3_label: "مطالعه تحقیقاتی",
        ai_speech: "سلام! من خیلی هیجان‌زده‌ام که امروز با تو صحبت کنم و بازی کنم! 🌟"
      },
      // Features Section
      features: {
        badge: "✨ فناوری انقلابی",
        title1: "چرا عامل هوش مصنوعی ما",
        title2: "همه چیز را تغییر می‌دهد",
        subtitle: "آینده توسعه زبان را با همراه پیشگام هوش مصنوعی ما تجربه کنید که درک می‌کند، پاسخ می‌دهد و با فرزندتان رشد می‌کند.",
        feature1: {
          title: "عامل هوش مصنوعی انسان‌نما",
          description: "همراه هوش مصنوعی ما دارای حالات چهره واقعی، حرکات طبیعی بدن و هوش عاطفی ویژه کودکان است.",
          highlight: "تشخیص چهره"
        },
        feature2: {
          title: "گفتگوی طبیعی",
          description: "پردازش پیشرفته زبان امکان گفتگوهای روان و متناسب با سن را فراهم می‌کند که با سطح ارتباط و علایق فرزندتان تطبیق می‌یابد.",
          highlight: "یادگیری تطبیقی"
        },
        feature3: {
          title: "پشتیبانی تخصصی LLE",
          description: "تکنیک‌های مبتنی بر تحقیق ویژه تأخیر در ظهور زبان، با فعالیت‌های شخصی‌سازی شده و ردیابی پیشرفت.",
          highlight: "مبتنی بر شواهد"
        },
        feature4: {
          title: "بازی‌های تعاملی",
          description: "فعالیت‌ها و بازی‌های جذاب که یادگیری زبان را سرگرم‌کننده می‌کنند و واژگان، تلفظ و مهارت‌های ارتباطی را تقویت می‌کنند.",
          highlight: "یادگیری بازی‌وار"
        },
        feature5: {
          title: "ردیابی پیشرفت",
          description: "تجزیه و تحلیل‌ها و گزارش‌های دقیق به والدین و مربیان کمک می‌کند تا توسعه زبان را نظارت کرده و دستاوردها را جشن بگیرند.",
          highlight: "داده‌های لحظه‌ای"
        },
        feature6: {
          title: "محیط امن",
          description: "پلتفرم منطبق با COPPA با اقدامات امنیتی پیشرفته، کنترل والدین و حفاظت امن از داده‌ها برای آرامش خیال.",
          highlight: "حریم خصوصی اول"
        },
        how_title1: "چگونه کار می‌کند در",
        how_title2: "۳ مرحله ساده",
        step1: {
          title: "ایجاد پروفایل",
          description: "پروفایل فرزندتان را با سن، علایق و اهداف توسعه زبان تنظیم کنید."
        },
        step2: {
          title: "با دوست هوش مصنوعی‌تان آشنا شوید",
          description: "فرزندتان با همراه هوش مصنوعی شخصی‌سازی شده‌اش آشنا می‌شود که با شخصیت او تطبیق می‌یابد."
        },
        step3: {
          title: "شروع یادگیری",
          description: "گفتگوها، بازی‌ها و فعالیت‌های تعاملی متناسب با نیازهای فرزندتان را آغاز کنید."
        }
      },
      // Testimonials Section
      testimonials: {
        badge: "💝 داستان‌های واقعی، نتایج واقعی",
        title1: "تحول زندگی‌ها",
        title2: "یک گفتگو در یک زمان",
        subtitle: "کشف کنید که همراه هوش مصنوعی ما چگونه به هزاران کودک کمک می‌کند تا بر چالش‌های زبانی غلبه کرده و اعتماد به نفس در ارتباط بسازند.",
        testimonial1: {
          name: "سارا جانسون",
          role: "والد اما (۴ ساله)",
          content: "اما در ۳ سالگی به سختی صحبت می‌کرد، اما پس از تنها ۲ماه با همراه هوش مصنوعی، او گفتگوهای کامل دارد! پیشرفت باورنکردنی بوده است.",
          highlight: "پیشرفت شگفت‌انگیز"
        },
        testimonial2: {
          name: "دکتر مایکل چن",
          role: "متخصص گفتار و زبان",
          content: "به عنوان یک متخصص، من تحت تأثیر رویکرد مبتنی بر تحقیق هستم. توانایی هوش مصنوعی برای تطبیق با نیازهای هر کودک برای درمان LLE انقلابی است.",
          highlight: "تأیید حرفه‌ای"
        },
        testimonial3: {
          name: "لیزا رودریگز",
          role: "مادر دوقلوها (۵ ساله)",
          content: "هر دو دوقلوی من چالش‌های زبانی متفاوتی داشتند. هوش مصنوعی رویکردهای منحصر به فردی برای هر کودک ایجاد کرد. آن‌ها اکنون عاشق صحبت کردن هستند و نمی‌توانند منتظر جلسات روزانه‌شان باشند!",
          highlight: "مراقبت شخصی"
        },
        testimonial4: {
          name: "جیمز تامپسون",
          role: "معلم دبستان",
          content: "من این را به چندین والد در کلاسم توصیه کرده‌ام. بهبود مهارت‌های ارتباطی و اعتماد به نفس کودکان قابل توجه بوده است.",
          highlight: "توصیه مربی"
        },
        testimonial5: {
          name: "ماریا گارسیا",
          role: "والد الکس (۶ ساله)",
          content: "الکس خیلی خجالتی بود و به ندرت صحبت می‌کرد. اکنون او گفتگو با خانواده و دوستان را شروع می‌کند. دوست هوش مصنوعی اعتماد به نفسی که نیاز داشت به او داد.",
          highlight: "تقویت اعتماد"
        },
        testimonial6: {
          name: "دکتر آماندا وایت",
          role: "متخصص توسعه کودک",
          content: "حالات چهره و تعاملات طبیعی محیطی ایجاد می‌کند که کودکان احساس امنیت برای تمرین می‌کنند. مثل داشتن دوستی صبور و درک‌کننده است.",
          highlight: "تأیید کارشناس"
        },
        stats: {
          satisfaction: "رضایت والدین",
          satisfaction_desc: "بر اساس ۲,۵۰۰+ نظر",
          improvement: "بهبود زبان",
          improvement_desc: "در ۳ ماه اول",
          children: "کودک یاری شده",
          children_desc: "در ۵۰+ کشور",
          research: "مطالعه تحقیقاتی",
          research_desc: "حمایت از رویکرد ما"
        }
      },
      // Call to Action Section
      cta: {
        badge: "🚀 پیشنهاد محدود",
        title1: "به فرزندتان هدیه",
        title2: "ارتباط با اعتماد بدهید",
        subtitle: "به هزاران خانواده‌ای بپیوندید که سفر زبانی فرزندشان را متحول کرده‌اند. آزمایش رایگان خود را امروز شروع کنید و شکوفایی فرزندتان را با اعتماد ببینید.",
        free_trial: {
          title: "آزمایش رایگان",
          price: "۰ تومان",
          description: "۷ روز • دسترسی کامل • بدون تعهد",
          button: "شروع آزمایش رایگان",
          feature1: "دسترسی کامل به همراه هوش مصنوعی",
          feature2: "ردیابی پیشرفت",
          feature3: "داشبورد والدین"
        },
        premium: {
          title: "طرح ممتاز",
          price: "۲۹ دلار",
          period: "در ماه",
          description: "همه چیز + ویژگی‌های پیشرفته",
          button: "دریافت ممتاز",
          popular: "محبوب‌ترین",
          feature1: "شخصیت‌های پیشرفته هوش مصنوعی",
          feature2: "تجزیه و تحلیل دقیق",
          feature3: "پشتیبانی اولویت‌دار"
        },
        trust: {
          coppa: "منطبق با COPPA",
          award: "برنده جایزه",
          research: "مبتنی بر تحقیق",
          guarantee: "ضمانت ۳۰ روزه"
        },
        footer_note: "✨ بدون هزینه راه‌اندازی • لغو هر زمان • پشتیبانی ۲۴/۷ • امن برای کودکان"
      },
      // Navigation
      nav: {
        product: "محصول",
        features: "ویژگی‌ها",
        pricing: "قیمت‌گذاری",
        demo: "نمونه",
        research: "تحقیق",
        support: "پشتیبانی",
        help_center: "مرکز راهنما",
        contact: "تماس با ما",
        parent_guide: "راهنمای والدین",
        safety: "ایمنی",
        company: "شرکت",
        about: "درباره ما",
        careers: "مشاغل",
        press: "مطبوعات",
        partners: "شرکای تجاری",
        legal: "قانونی",
        privacy: "سیاست حریم خصوصی",
        terms: "شرایط خدمات",
        coppa_compliance: "انطباق COPPA",
        data_security: "امنیت داده"
      },
      footer: "© ۲۰۲۴ دوست زبان هوش مصنوعی. تمام حقوق محفوظ است. با ❤️ برای کودکان و خانواده‌ها ساخته شده."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;    