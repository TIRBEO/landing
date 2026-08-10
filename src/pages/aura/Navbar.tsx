import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Menu, Settings2, X } from "lucide-react";
import { LogoMark, Magnetic, SectionEyebrow, gradientStyle } from "./primitives";
import { useLandingConfig } from "../../lib/landing-config";

/* ── Section 1 — Navbar ──────────────────────────────────────────────────── */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#dashboard" },
  { label: "Documentation", href: "https://support.tirbeo.app/docs" },
  { label: "Support", href: "https://support.tirbeo.app" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const cfg = useLandingConfig();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 max-w-6xl mx-auto px-6 py-6"
    >
      <div className="flex items-center justify-between">
        <a href="#top" aria-label="Tirbeo home" className="flex shrink-0 items-center gap-2 group/logo">
          <LogoMark className="w-8 h-8 text-white transition-transform duration-300 group-hover/logo:scale-110" />
          <span className="text-lg font-semibold tracking-tight text-white">{cfg.brand}</span>
        </a>
        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((link, i) => {
            const external = link.href.startsWith("http");
            return (
              <motion.a
                key={link.label}
                href={link.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                className="text-white/70 text-sm font-medium hover:text-white transition-colors"
              >
                {link.label}
              </motion.a>
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-5">
          <a
            href={cfg.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 text-sm font-medium hover:text-white transition-colors"
          >
            Login
          </a>
          <a
            href={cfg.waitlistAnchor}
            className="rounded-full btn-gradient text-white text-sm font-medium px-5 py-3"
          >
            Join Waitlist
          </a>
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#050507]/95 backdrop-blur-xl p-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2">
                <a
                  href={cfg.loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Login
                </a>
                <a
                  href={cfg.waitlistAnchor}
                  onClick={() => setOpen(false)}
                  className="rounded-full btn-gradient text-white text-sm font-medium px-5 py-3 text-center"
                >
                  Join Waitlist
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent("tirbeo:manage-cookies"));
                  }}
                  className="px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Manage cookies
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ── Section 2 — Hero (Tirbeo) ───────────────────────────────────────────── */
export function Hero() {
  const cfg = useLandingConfig();
  const headline = cfg.headline || "Make technology human.";
  const subhead =
    cfg.subhead ||
    "Tirbeo builds people-first products and experiences — cleaner workspaces, clearer conversations, and private-by-default design.";

  // Split headline into words, preserving the final word for the accent line.
  const words = headline.trim().split(/\s+/);
  const line1 = words.length > 1 ? words.slice(0, -1) : words;
  const line2 = words.length > 1 ? [words[words.length - 1]] : [];

  return (
    <section
      className="relative z-10 pt-14 md:pt-24 pb-16 md:pb-20 text-center flex flex-col items-center px-6 overflow-visible"
      aria-label="Hero"
    >
      {/* Floating orbs behind the headline (parallax bokeh, cyan only) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span
          className="hero-orb hero-orb--a left-[12%] top-[6%] w-72 h-72 md:w-96 md:h-96"
          style={{ background: "radial-gradient(circle, rgba(0,210,255,0.16), transparent 70%)" }}
        />
        <span
          className="hero-orb hero-orb--b right-[10%] top-[18%] w-80 h-80 md:w-[26rem] md:h-[26rem]"
          style={{ background: "radial-gradient(circle, rgba(0,210,255,0.1), transparent 70%)" }}
        />
        <span
          className="hero-orb hero-orb--c left-[38%] top-[55%] w-64 h-64 md:w-80 md:h-80"
          style={{ background: "radial-gradient(circle, rgba(0,210,255,0.08), transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <SectionEyebrow label="Independent technology company" center />
      </motion.div>

      {/* Word-stagger headline (DB-driven, with fallback) */}
      <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[0.9]">
        <span className="block text-white">
          {line1.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.32 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.22em]"
            >
              {word}
            </motion.span>
          ))}
        </span>
        {line2.length > 0 && (
          <span className="block animate-shiny" style={gradientStyle}>
            {line2.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.55 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.22em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
        )}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        className="mt-8 text-white/60 max-w-md text-base leading-[1.5]"
      >
        {subhead}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.6, ease: "easeOut" }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.3}>
            <a
              href="#waitlist"
              className="inline-block rounded-full btn-gradient text-white text-sm font-medium px-6 py-3"
            >
              Join early access
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="#about"
              className="inline-block rounded-full border border-white/15 text-white text-sm font-medium px-6 py-3 transition-all hover:border-white/30 hover:bg-white/5"
            >
              Learn more
            </a>
          </Magnetic>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#dashboard"
        aria-label="Scroll to see the product preview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="scroll-cue mt-14 md:mt-16 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
      >
        <span className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <span className="w-1 h-2 rounded-full bg-white/50 animate-bounce" />
        </span>
        <ChevronDown className="w-4 h-4 -mt-1" />
      </motion.a>
    </section>
  );
}
