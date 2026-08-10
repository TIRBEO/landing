import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Cpu,
  FlaskConical,
  Gem,
  HeartHandshake,
  Lightbulb,
  MessagesSquare,
  Mountain,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SectionEyebrow, gradientStyle } from "./primitives";
import { submitWaitlist } from "../../lib/waitlist";

/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — company landing sections (premium editorial, colorful cinematic)
   Each section carries its own accent color for chips, numerals & rails.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Section 3 — What we ship (cyan) ─────────────────────────────────────── */
const SHIP_CARDS = [
  {
    icon: ShieldCheck,
    title: "Private-first",
    body: "Spaces built to respect attention and privacy.",
    chip: "icon-chip--cyan",
    iconColor: "text-[#ffffff]",
  },
  {
    icon: MessagesSquare,
    title: "Contextual",
    body: "Keep conversations grounded in people and projects.",
    chip: "icon-chip--violet",
    iconColor: "text-[#ffffff]",
  },
];

export function WhatWeShip() {
  return (
    <section id="products" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <div className="grid md:grid-cols-2 gap-14 md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-24 self-start"
        >
          <SectionEyebrow label="What we ship" />
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98] text-white">
            Focused tools
            <br />
            <span className="aura-text-cyan">for teams.</span>
          </h2>
          <p className="mt-6 text-white/55 text-base md:text-lg leading-[1.7] max-w-md">
            Clear spaces, contextual conversation, and controls you can trust.
          </p>
        </motion.div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SHIP_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease: "easeOut" }}
              className="group py-8 md:py-10 flex items-start gap-6"
            >
              <span className={`icon-chip ${card.chip} mt-1 w-12 h-12 shrink-0 rounded-full flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                    {card.title}
                  </h3>
                  <span className="text-xs font-semibold tracking-[0.18em] text-white/25">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-2 text-white/55 text-sm md:text-base leading-[1.7] max-w-sm">
                  {card.body}
                </p>
              </div>
              <ArrowRight className="mt-1 w-5 h-5 shrink-0 text-white/20 transition-all duration-300 group-hover:text-[#ffffff] group-hover:translate-x-1 group-hover:-rotate-45" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 4 — About (violet) ──────────────────────────────────────────── */
const HOW_WE_WORK = [
  { n: "01", title: "Explore", body: "Find problems worth solving." },
  { n: "02", title: "Build", body: "Turn ideas into something tangible." },
  { n: "03", title: "Grow", body: "Build patiently for the long term." },
];

export function About() {
  return (
    <section id="about" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <SectionEyebrow label="About Tirbeo" />
        <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0] text-white max-w-3xl">
          A company in the making.
          <br />
          <span className="aura-text-violet">An idea becoming something real.</span>
        </h2>
      </motion.div>
      <div className="mt-16 grid lg:grid-cols-2 gap-14 lg:gap-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-white/55 text-base md:text-lg leading-[1.8] max-w-md lg:pt-2"
        >
          We build technology with purpose. Tirbeo is an independent technology
          company exploring what comes next. We work across ideas, software,
          products, and experiences — looking for better ways to connect people,
          creativity, and technology.
        </motion.p>
        <div className="border-t border-white/10">
          {HOW_WE_WORK.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.08 * i, duration: 0.6, ease: "easeOut" }}
              className="group border-b border-white/10 py-7 flex items-baseline gap-6"
            >
              <span className="ghost-num ghost-num--violet w-20 shrink-0" aria-hidden="true">
                {step.n}
              </span>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[#c4b5fd]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-white/50 text-sm md:text-base leading-[1.6]">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 5 — What we're building (pink) ──────────────────────────────── */
const BUILDING_THREADS = [
  {
    icon: Cpu,
    title: "Technology",
    body: "Software and systems designed to make complex things simpler.",
    chip: "icon-chip--cyan",
    iconColor: "text-[#ffffff]",
  },
  {
    icon: Users,
    title: "Connection",
    body: "Tools and experiences that help people communicate and collaborate.",
    chip: "icon-chip--violet",
    iconColor: "text-[#ffffff]",
  },
  {
    icon: FlaskConical,
    title: "Experiments",
    body: "New ideas worth exploring before they become something bigger.",
    chip: "icon-chip--pink",
    iconColor: "text-[#cccccc]",
  },
];

export function WhatWereBuilding() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-24 self-start"
        >
          <SectionEyebrow label="What we're building" />
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98] text-white">
            More than
            <br />
            <span className="aura-text-white">one idea.</span>
          </h2>
          <p className="mt-6 text-white/55 text-base md:text-lg leading-[1.7] max-w-md">
            Tirbeo is being built as a home for multiple ideas and technologies.
            Some will become products. Some will become experiments. The common
            thread is simple: build useful things that matter.
          </p>
        </motion.div>
        <div className="flex flex-col">
          {BUILDING_THREADS.map((thread, i) => (
            <motion.div
              key={thread.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: "easeOut" }}
              className="group py-8 md:py-9 flex items-start gap-6 border-b border-white/10 first:border-t"
            >
              <span className={`icon-chip ${thread.chip} mt-1 w-12 h-12 shrink-0 rounded-full flex items-center justify-center`}>
                <thread.icon className={`w-5 h-5 ${thread.iconColor}`} />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                    {thread.title}
                  </h3>
                  <span className="text-xs font-semibold tracking-[0.18em] text-white/25">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-2 text-white/55 text-sm md:text-base leading-[1.7] max-w-sm">
                  {thread.body}
                </p>
              </div>
              <ArrowRight className="mt-1 w-5 h-5 shrink-0 text-white/20 transition-all duration-300 group-hover:text-[#cccccc] group-hover:translate-x-1 group-hover:-rotate-45" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 6 — The Journey (colorful rail) ─────────────────────────────── */
const JOURNEY_STEPS = [
  {
    status: "NOW",
    n: "01",
    title: "The Idea",
    body: "Start with a question. What could technology look like if it was designed around people first?",
    active: true,
    color: "#ffffff",
  },
  {
    status: "EXPLORING",
    n: "02",
    title: "The Work",
    body: "Explore what could exist. We investigate ideas, technologies, and opportunities that could become meaningful products and experiences.",
    active: false,
    color: "#ffffff",
  },
  {
    status: "BUILDING",
    n: "03",
    title: "The Process",
    body: "Turn possibility into reality. Ideas become prototypes. Prototypes become systems. We learn by making things real.",
    active: false,
    color: "#cccccc",
  },
  {
    status: "2027",
    n: "04",
    title: "The Next Chapter",
    body: "Bring the work into the world. 2027 marks a new chapter as Tirbeo begins turning its work into products, platforms, and companies.",
    active: true,
    color: "#999999",
  },
];

export function Journey() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 75%", "end 65%"],
  });
  const fillScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="journey" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <SectionEyebrow label="The journey" />
        <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0] text-white">
          No straight path.
        </h2>
        <p className="mt-6 text-white/55 text-base md:text-lg leading-[1.7] max-w-md">
          Tirbeo isn't following a predetermined roadmap. We're learning,
          building, changing, and moving forward as we go.
        </p>
      </motion.div>
      <div ref={trackRef} className="mt-16 relative">
        {/* Colorful timeline rail — scroll-fill track + gradient fill */}
        <div
          className="absolute left-[13px] md:left-[15px] top-2 bottom-2 w-px bg-white/[0.07]"
          aria-hidden="true"
        />
        <motion.div
          className="journey-fill"
          style={{ scaleY: fillScale }}
          aria-hidden="true"
        />
        <div className="space-y-10 md:space-y-12">
          {JOURNEY_STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.06 * i, duration: 0.6, ease: "easeOut" }}
              className="relative pl-12 md:pl-16"
            >
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
                className={`absolute left-0 top-1.5 w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center ${
                  step.active
                    ? "border-white/30 bg-[#0c0c0c]"
                    : "border-white/15 bg-[#0c0c0c]"
                }`}
                style={step.active ? { boxShadow: `0 0 20px ${step.color}66` } : undefined}
                aria-hidden="true"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${step.active ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: step.color }}
                />
              </motion.span>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-[0.18em] ${
                    step.active
                      ? "border-white/20 text-white/80"
                      : "border-white/10 text-white/45"
                  }`}
                >
                  {step.status}
                </span>
                <span className="text-xs font-semibold tracking-[0.18em] text-white/25">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-white/55 text-sm md:text-base leading-[1.7] max-w-2xl">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section 7 — Principles (mixed accent colors) ────────────────────────── */
const PRINCIPLES = [
  { icon: Lightbulb, title: "Curiosity", body: "We start with questions. Better questions lead to better things.", chip: "icon-chip--cyan", iconColor: "text-[#ffffff]", num: "ghost-num--cyan" },
  { icon: HeartHandshake, title: "People", body: "Technology matters because of what it enables people to do together.", chip: "icon-chip--violet", iconColor: "text-[#ffffff]", num: "ghost-num--violet" },
  { icon: Gem, title: "Craft", body: "We care about the details, from the first idea to the final experience.", chip: "icon-chip--pink", iconColor: "text-[#cccccc]", num: "ghost-num--pink" },
  { icon: Mountain, title: "Long-term", body: "We're not trying to build everything at once. We're building something that lasts.", chip: "icon-chip--amber", iconColor: "text-[#999999]", num: "ghost-num--amber" },
];

export function Principles() {
  return (
    <section id="principles" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <SectionEyebrow label="What guides us" />
        <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0] text-white">
          Build with{" "}
          <span className="aura-text-rainbow">intention.</span>
        </h2>
      </motion.div>
      <div className="mt-16 grid sm:grid-cols-2 border-t border-l border-white/10">
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.06 * i, duration: 0.6, ease: "easeOut" }}
            className="group tilt-card-hover relative border-b border-r border-white/10 p-8 md:p-10 transition-colors duration-500 hover:bg-white/[0.02]"
          >
            <span className="tilt-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
            <span className={`ghost-num ${p.num} absolute top-6 right-7`} aria-hidden="true">
              0{i + 1}
            </span>
            <span className={`icon-chip ${p.chip} w-11 h-11 rounded-full flex items-center justify-center`}>
              <p.icon className={`w-5 h-5 ${p.iconColor}`} />
            </span>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
              {p.title}
            </h3>
            <p className="mt-3 text-white/50 text-sm md:text-base leading-[1.7] max-w-xs">
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Section 8 — The Next Chapter (2027, rainbow) ────────────────────────── */
export function NextChapter() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const glowOpacity = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="future" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="liquid-glass relative overflow-hidden rounded-[2rem] px-8 py-20 md:py-28 w-full"
      >
        <motion.div
          ref={cardRef}
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            opacity: glowOpacity,
            background:
              "radial-gradient(700px circle at 50% 0%, rgba(139,92,246,0.22), transparent 60%), radial-gradient(500px circle at 80% 90%, rgba(255,95,162,0.16), transparent 60%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <SectionEyebrow label="The next chapter" center />
          <span
            className="mt-10 text-8xl md:text-[10rem] font-extrabold tracking-tighter leading-none animate-shiny"
            style={{ ...gradientStyle, filter: undefined }}
          >
            2027
          </span>
          <h2 className="mt-8 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02] text-white">
            Something real is coming.
          </h2>
          <p className="mt-6 text-white/55 max-w-md text-base leading-[1.7]">
            2027 marks an important chapter for Tirbeo. It's when the work we've
            been exploring starts becoming visible to the world.
          </p>
          <a
            href="#waitlist"
            className="group mt-10 inline-flex items-center gap-2 rounded-full btn-gradient text-white font-medium text-sm px-7 py-3.5"
          >
            Stay connected
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-[3px]" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Section 9 — Waitlist (colorful form) ────────────────────────────────── */
type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#ffffff]/60 focus:outline-none focus:ring-1 focus:ring-[#ffffff]/30 transition-colors duration-300";

export function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setState("submitting");
    setError("");
    try {
      await submitWaitlist({ name: name.trim(), email: email.trim(), message: message.trim() || undefined });
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="waitlist" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-24 self-start"
        >
          <SectionEyebrow label="Stay connected" />
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98] text-white">
            Be part of
            <br />
            <span className="aura-text-rainbow">what's next.</span>
          </h2>
          <p className="mt-6 text-white/55 text-base md:text-lg leading-[1.7] max-w-md">
            Want to hear what Tirbeo is working on? Leave your details and we'll
            keep you informed as the company takes shape.
          </p>
          <ul className="mt-10 space-y-3">
            {["Company updates", "New projects and products", "Important Tirbeo announcements"].map((item, i) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                <span
                  className="w-5 h-5 rounded-full border flex items-center justify-center"
                  style={{ borderColor: `rgba(${i === 0 ? "0,210,255" : i === 1 ? "139,92,246" : "255,95,162"},0.5)` }}
                >
                  <Check className="w-3 h-3" style={{ color: i === 0 ? "#ffffff" : i === 1 ? "#aaaaaa" : "#bbbbbb" }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs tracking-[0.18em] text-white/30">TIRBEO / 2027</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 md:p-10"
        >
          {state === "success" ? (
            <div className="text-center py-16">
              <span className="mx-auto w-14 h-14 rounded-full btn-gradient flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </span>
              <h3 className="mt-6 text-white font-semibold text-xl">You're on the list.</h3>
              <p className="mt-3 text-white/55 text-sm leading-[1.7]">
                Thanks for your interest — we'll keep you posted as things take shape.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-white font-semibold text-lg">
                Keep me <span className="aura-text-violet">posted.</span>
              </h3>
              <div>
                <label htmlFor="waitlist-name" className="block text-xs text-white/45 mb-2 uppercase tracking-[0.14em]">
                  Your name *
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="waitlist-email" className="block text-xs text-white/45 mb-2 uppercase tracking-[0.14em]">
                  Email address *
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="waitlist-message" className="block text-xs text-white/45 mb-2 uppercase tracking-[0.14em]">
                  Message (optional)
                </label>
                <textarea
                  id="waitlist-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're curious about…"
                  className={`${inputClass} resize-none`}
                />
              </div>
              {state === "error" && (
                <p className="text-xs text-white">{error}</p>
              )}
              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full rounded-full btn-gradient text-white font-medium text-sm px-7 py-3.5 disabled:opacity-60"
              >
                {state === "submitting" ? "Signing up…" : "Join the waitlist"}
              </button>
              <p className="text-[11px] text-white/35 leading-[1.6]">
                We only use your details to communicate about Tirbeo.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section 10 — Final CTA ──────────────────────────────────────────────── */
export function FinalCTA() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36 text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <SectionEyebrow label="Building toward 2027" center />
        <h2 className="mt-8 text-4xl md:text-7xl font-semibold tracking-tight leading-[0.98] text-white">
          Be part of{" "}
          <span className="aura-text-rainbow">what's next.</span>
        </h2>
        <p className="mt-8 text-white/55 max-w-md mx-auto text-base leading-[1.7]">
          Tirbeo is building technology for better conversations, communities,
          and collaboration. Join the early access list and follow what we're
          building.
        </p>
        <a
          href="#waitlist"
          className="group mt-12 inline-flex items-center gap-2 rounded-full btn-gradient text-white font-medium text-sm px-8 py-4"
        >
          Join the waitlist
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-[3px]" />
        </a>
      </motion.div>
    </section>
  );
}

/* ── Section 11 — Footer ─────────────────────────────────────────────────── */
const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Tirbeo Collab", href: "#dashboard" },
      { label: "Preview", href: "#dashboard" },
      { label: "Early Access", href: "#waitlist" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "About", href: "#about" },
      { label: "How It Works", href: "#journey" },
      { label: "Journey", href: "#journey" },
      { label: "Support", href: "https://support.tirbeo.app" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: "https://support.tirbeo.app" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <p className="text-white font-semibold text-xl tracking-tight">
              Technology that brings{" "}
              <span className="aura-text-cyan">people closer.</span>
            </p>
            <p className="mt-4 text-white/45 text-sm leading-[1.7] max-w-xs">
              A technology company exploring better ways for people to connect,
              create, collaborate, and build meaningful things together.
            </p>
            <a
              href="https://support.tirbeo.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors"
            >
              Support
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/35">{col.heading}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  const internalRoute = link.href.startsWith("/");
                  if (internalRoute) {
                    return (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="accent-underline text-sm text-white/55 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="accent-underline text-sm text-white/55 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35">
          <span>© 2026 Tirbeo. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-white/70 transition-colors">Cookies</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("tirbeo:manage-cookies"))}
              className="hover:text-white/70 transition-colors cursor-pointer"
            >
              Manage cookies
            </button>
          </div>
        </div>
      </div>
      {/* Decorative marquee — colorful gradient text */}
      <div className="border-t border-white/10 py-5 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap will-change-transform">
          {[0, 1].map((dup) => (
            <span key={dup} className="flex shrink-0 items-center gap-12 pr-12 text-sm font-semibold tracking-[0.24em]">
              <span className="aura-text-cyan">TIRBEO</span>
              <span className="aura-text-violet">BUILD WHAT'S NEXT</span>
              <span className="aura-text-white">COMING 2027</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
