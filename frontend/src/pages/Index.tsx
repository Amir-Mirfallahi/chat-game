import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { initScrollAnimations } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Index() {
  useEffect(() => {
    initScrollAnimations();
  }, []);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <Button
        className="sticky top-10 left-5 z-[1000] rounded-lg bg-orange-400"
        size="lg"
      >
        {isAuthenticated ? "داشبورد" : "ورود/ثبت نام"}
      </Button>
      <Hero />
      <Features />
      <Workflow />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
