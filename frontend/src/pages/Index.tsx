import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { initScrollAnimations } from "@/lib/animations";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  useEffect(() => {
    initScrollAnimations();
  }, []);
  const { isAuthenticated } = useAuth();
  let navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Button
        className="sticky top-10 left-5 z-[1000] rounded-lg bg-orange-400 cursor-pointer"
        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
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
