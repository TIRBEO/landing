import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { SectionEyebrow, TiltCard } from "./primitives";

/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — AI chat demo ("talk to your workspace")
   ══════════════════════════════════════════════════════════════════════════ */

type ChatMessage = { role: "bot" | "user"; text: string };

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "bot",
    text: "Hey! I'm Tirbeo's assistant. I can summarize conversations, surface action items, and find what you need across your workspace. What are we working on?",
  },
];

const SUGGESTIONS = [
  "Summarize the Q3 roadmap",
  "What needs my attention?",
  "Find the design review notes",
];

function replyTo(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("roadmap") || q.includes("summary")) {
    return "Here's the Q3 roadmap in one line: beta window locked for September, three open action items (hero copy, aurora background, waitlist email flow), and no blockers on the team's critical path. Want the full breakdown?";
  }
  if (q.includes("attention") || q.includes("action")) {
    return "Three things need you today: approve the final hero copy, review the landing PR, and confirm the waitlist email template. Everything else is on track.";
  }
  if (q.includes("design") || q.includes("review")) {
    return "Found it — the design review notes are pinned in #design. Key feedback: the aurora background is approved, headline spacing needs one tweak, and the CTA gradient is good to ship.";
  }
  return "Got it. I've pulled that into context. If you want, I can summarize the related conversations or turn it into an action item — just say the word.";
}

export function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const timerRef = useRef<number | null>(null);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setTyping(true);
    timerRef.current = window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: replyTo(trimmed) }]);
      setTyping(false);
      timerRef.current = null;
    }, 1100);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section id="chat" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-24 self-start"
        >
          <SectionEyebrow label="Talk to your workspace" tag="AI-native" />
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98] text-white">
            Ask anything.
            <br />
            <span className="aura-text-rainbow">Get clarity.</span>
          </h2>
          <p className="mt-6 text-white/55 text-base md:text-lg leading-[1.7] max-w-md">
            Tirbeo's assistant reads your conversations, projects, and
            documents — then answers in plain language. Context in, clarity out.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Summarize any conversation or project",
              "Surface action items and deadlines",
              "Find the thread you forgot you had",
            ].map((item, i) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                <span
                  className="w-5 h-5 shrink-0 rounded-full border flex items-center justify-center"
                  style={{ borderColor: i === 0 ? "rgba(0,210,255,0.5)" : i === 1 ? "rgba(139,92,246,0.5)" : "rgba(255,95,162,0.5)" }}
                >
                  <Sparkles className="w-2.5 h-2.5" style={{ color: i === 0 ? "#ffffff" : i === 1 ? "#aaaaaa" : "#bbbbbb" }} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Chat window — 3D tilt on hover */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard max={4} className="tilt-card-hover relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-black/30">
            <span className="w-8 h-8 rounded-full icon-chip icon-chip--violet flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#c4b5fd]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Tirbeo Assistant</p>
              <p className="text-[10px] text-[#ffffff] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff] animate-pulse" />
                Online · grounded in your workspace
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-72 overflow-y-auto px-4 py-4 space-y-3">
            <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={`${m.role}-${i}-${m.text.slice(0, 12)}`}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "bot" && (
                  <span className="w-6 h-6 shrink-0 rounded-full icon-chip icon-chip--violet flex items-center justify-center">
                    <Bot className="w-3 h-3 text-[#c4b5fd]" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.6] ${
                    m.role === "bot"
                      ? "bg-white/[0.06] text-white/80 rounded-tl-sm"
                      : "btn-gradient text-white rounded-tr-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <span className="w-6 h-6 shrink-0 rounded-full icon-chip icon-chip--cyan flex items-center justify-center">
                    <User className="w-3 h-3 text-[#a4f4fd]" />
                  </span>
                )}
              </motion.div>
            ))}
            </AnimatePresence>
            {typing && (
              <div className="flex gap-2.5">
                <span className="w-6 h-6 shrink-0 rounded-full icon-chip icon-chip--violet flex items-center justify-center">
                  <Bot className="w-3 h-3 text-[#c4b5fd]" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={typing}
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] text-white/60 transition-colors hover:text-white hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 flex items-center gap-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask your workspace…"
              className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors duration-300"
            />
            <button
              type="button"
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="w-10 h-10 shrink-0 rounded-full btn-gradient flex items-center justify-center text-white disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
