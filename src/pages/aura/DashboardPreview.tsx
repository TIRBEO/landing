import { motion } from "motion/react";
import {
  Bell,
  FolderKanban,
  Hash,
  Home,
  MessagesSquare,
  Paperclip,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Counter, SectionEyebrow, TiltCard } from "./primitives";

/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — Collab dashboard live preview (replaces the old email inbox mockup)
   ══════════════════════════════════════════════════════════════════════════ */

const SIDEBAR_ITEMS = [
  { icon: Home, label: "Home", count: undefined },
  { icon: MessagesSquare, label: "Conversations", count: "12" },
  { icon: Hash, label: "Channels", count: "8" },
  { icon: Users, label: "People", count: undefined },
  { icon: FolderKanban, label: "Projects", count: "3" },
];

const CONVERSATIONS = [
  {
    name: "Ava",
    title: "Q3 roadmap review",
    preview: "Let's lock the dates before Friday. Marcus shared the draft...",
    time: "9:41 AM",
    unread: true,
    active: true,
    color: "#ffffff",
  },
  {
    name: "Design",
    title: "Landing hero — final pass",
    preview: "Love the aurora background. One note on the headline spacing...",
    time: "8:12 AM",
    unread: true,
    color: "#ffffff",
  },
  {
    name: "Stripe",
    title: "Payout of $12,480.00 sent",
    preview: "Your payout is on its way to your bank account...",
    time: "Yesterday",
    unread: false,
    color: "#cccccc",
  },
  {
    name: "Deploy",
    title: "tirbeo-web ready",
    preview: "Preview is live at preview.tirbeo.app — all checks passed...",
    time: "Mon",
    unread: false,
    color: "#999999",
  },
];

const KPIS = [
  { label: "Active conversations", value: 128, delta: "+12%", color: "#ffffff" },
  { label: "Tasks completed", value: 47, delta: "+8%", color: "#ffffff" },
  { label: "Projects on track", value: 9, delta: "—", color: "#cccccc" },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-36">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-24 self-start"
        >
          <SectionEyebrow label="Tirbeo Collab" tag="Live preview" />
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.98] text-white">
            Your workspace,
            <br />
            <span className="aura-text-rainbow">finally in focus.</span>
          </h2>
          <p className="mt-6 text-white/55 text-base md:text-lg leading-[1.7] max-w-md">
            Conversations, projects, and people — grounded together in one
            private, contextual space. No noise, no chaos, no lost threads.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Private-first", "Contextual", "AI-assisted"].map((chip, i) => (
              <span
                key={chip}
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/70"
                style={
                  i === 0
                    ? { borderColor: "rgba(0,210,255,0.35)" }
                    : i === 1
                      ? { borderColor: "rgba(139,92,246,0.4)" }
                      : { borderColor: "rgba(255,95,162,0.4)" }
                }
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dashboard window — 3D tilt on hover */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard max={4} className="tilt-card-hover relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-white/50">Tirbeo Collab — Workspace</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#A4F4FD]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff] animate-pulse" />
              Live
            </span>
          </div>

          <div className="grid grid-cols-12 h-[520px] text-left">
            {/* Sidebar */}
            <div className="relative col-span-3 border-r border-white/10 bg-black/30 p-3 hidden sm:block">
              <div className="flex items-center gap-2 px-1.5 py-2">
                <span className="w-6 h-6 rounded-lg btn-gradient flex items-center justify-center text-[10px] font-bold text-white">
                  T
                </span>
                <span className="text-xs font-semibold text-white">Tirbeo</span>
                <Bell className="ml-auto w-3.5 h-3.5 text-white/40" />
              </div>
              <div className="mt-2 space-y-0.5">
                {SIDEBAR_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs ${
                      item.label === "Conversations"
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.count && (
                      <span className="ml-auto text-[10px] text-white/50">{item.count}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="px-2.5 text-[9px] uppercase tracking-[0.18em] text-white/30">Workspaces</p>
                <div className="mt-2 flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-white/60">
                  <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#ffffff] to-gray-600" />
                  Collab
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 hidden sm:flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-white/60 hover:bg-white/5">
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </div>
            </div>

            {/* Conversation list */}
            <div className="col-span-12 sm:col-span-9 md:col-span-4 border-r border-white/10">
              <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10">
                <Search className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/30">Search workspace…</span>
              </div>
              <div className="divide-y divide-white/5">
                {CONVERSATIONS.map((c, ci) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: 0.15 + ci * 0.08, duration: 0.5, ease: "easeOut" }}
                    className={`px-3 py-3 ${
                      c.active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${c.color}, #0b2551)` }}
                      >
                        {c.name.slice(0, 1)}
                      </span>
                      <span className="text-xs font-semibold text-white">{c.name}</span>
                      <span className="ml-auto text-[9px] text-white/40">{c.time}</span>
                    </div>
                    <p className={`mt-1 text-[11px] ${c.unread ? "text-white/80 font-medium" : "text-white/50"}`}>
                      {c.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/40 truncate">{c.preview}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reader */}
            <div className="col-span-5 hidden md:block p-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                  <FolderKanban className="w-3.5 h-3.5 text-white/60" />
                </span>
                <span className="text-xs font-semibold text-white">Q3 roadmap review</span>
                <span className="ml-auto px-2 py-0.5 rounded-full border border-white/10 text-[9px] text-white/50">
                  #roadmap
                </span>
              </div>

              {/* AI summary card */}
              <div className="mt-4 rounded-xl border border-[#ffffff]/20 bg-[#ffffff]/[0.05] p-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#A4F4FD]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A4F4FD]">
                    Summary by Tirbeo
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-white/70 leading-[1.6]">
                  The team agreed on the September beta window. Three action
                  items are open: finalize hero copy, ship the aurora background,
                  and confirm the waitlist email flow. No blockers.
                </p>
              </div>

              <div className="mt-4 space-y-2.5 text-[11px] text-white/60 leading-[1.6]">
                <p>Ava: "Locking the dates for the Q3 review — Friday works?"</p>
                <p>Marcus: "Draft is up in the workspace. Feedback by Wednesday."</p>
                <p>David: "Beta window confirmed. Shipping the preview build today."</p>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-white/60">
                <Paperclip className="w-3 h-3" />
                roadmap-draft-v3.pdf
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/20">
            {KPIS.map((kpi, ki) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: 0.25 + ki * 0.09, duration: 0.5, ease: "easeOut" }}
                className="px-4 py-3.5"
              >
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/40">{kpi.label}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <Counter value={kpi.value} className="text-lg font-semibold text-white" />
                  <span className="text-[10px] font-medium" style={{ color: kpi.color }}>
                    {kpi.delta}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
