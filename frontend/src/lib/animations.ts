import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initHeroAnimations = () => {
  const tl = gsap.timeline();

  tl.from(".hero-title", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power3.out",
  })
    .from(
      ".hero-subtitle",
      {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .from(
      ".hero-cta",
      {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: "power3.out",
      },
      "-=0.3"
    )
    .from(
      ".ai-agent-preview",
      {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.8"
    );

  return tl;
};

export const initScrollAnimations = () => {
  gsap.utils.toArray(".animate-on-scroll").forEach((element: Element) => {
    gsap.fromTo(
      element,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

export const initFeatureAnimations = () => {
  gsap.utils.toArray(".feature-card").forEach((card: Element, index) => {
    gsap.fromTo(
      card,
      {
        y: 60,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

export const initAIAgentAnimation = () => {
  // Floating animation for AI agent
  gsap.to(".ai-agent-float", {
    y: -10,
    duration: 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Pulse animation for interactive elements
  gsap.to(".ai-pulse", {
    scale: 1.05,
    duration: 1.5,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1,
  });
};
