import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Navbar, Hero } from "./aura/Navbar";
import { CookieConsent } from "./aura/CookieConsent";
import { DashboardPreview } from "./aura/DashboardPreview";
import { ChatSection } from "./aura/ChatSection";
import {
  About,
  FinalCTA,
  Footer,
  Journey,
  NextChapter,
  Principles,
  Waitlist,
  WhatWereBuilding,
  WhatWeShip,
} from "./aura/TirbeoSections";
import "./aura.css";

/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO LANDING — colorful cinematic (Aura aesthetic), company story.
   Animated aurora background · gradient headlines · per-section accents.
   ══════════════════════════════════════════════════════════════════════════ */

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      href="#top"
      aria-label="Back to top"
      className="back-to-top"
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ArrowUp className="w-4 h-4" />
    </motion.a>
  );
}

export default function Landing() {
  useEffect(() => {
    document.title = "Tirbeo — Make technology human.";
  }, []);

  return (
    <div className="aura relative min-h-screen overflow-x-hidden bg-black text-white">
      <ScrollProgress />
      {/* Film grain overlay (subtle cinematic texture) */}
      <div className="aura-grain" aria-hidden="true" />

      {/* Animated colorful aurora background (fixed, behind everything) */}
      <div className="aura-aurora" aria-hidden="true" />

      {/* Optional faint video texture above the aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-15"
          src={VIDEO_URL}
        />
      </div>

      {/* Fixed guide lines at the 36rem container edges */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%_+_36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%_+_36rem)] w-px bg-white/10 z-[5]" />

      {/* Root SVG noise filter (subtle grain for the shiny headline) */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"
          />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      <div id="top" className="relative z-10">
        <Navbar />
        <Hero />
        <DashboardPreview />
        <ChatSection />
        <WhatWeShip />
        <About />
        <WhatWereBuilding />
        <Journey />
        <Principles />
        <NextChapter />
        <Waitlist />
        <FinalCTA />
        <Footer />
      </div>

      <CookieConsent />
      <BackToTop />
    </div>
  );
}
