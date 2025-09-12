import { useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { initScrollAnimations } from "@/lib/animations";

export default function Index() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Workflow />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
