import { motion } from "framer-motion";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const MISSION = [
  "Tirbeo is built to make social networking feel personal again. We believe the best online experiences come from genuine conversations, shared interests, and communities where people feel welcome.",
  "Instead of endless scrolling, our platform encourages meaningful interactions that create real value and lasting connections. Every feature is designed with people in mind.",
  "Whether you're discovering local communities, meeting like-minded individuals, or sharing your ideas with the world, Tirbeo provides a clean, distraction-free space where authentic conversations can naturally grow.",
  "We prioritize privacy, performance, and simplicity. From secure messaging and modern technology to a fast, responsive experience across every device, Tirbeo is built to be reliable, intuitive, and respectful of your time and attention.",
];

const VALUES = [
  {
    icon: <Users className="size-5" />,
    title: "People first",
    color: "bg-nb-yellow",
    desc: "Every decision starts with a person, not a metric. If it doesn't help real conversations, it doesn't ship.",
  },
  {
    icon: <HeartHandshake className="size-5" />,
    title: "Genuine connection",
    color: "bg-nb-pink",
    desc: "We build for depth, not time-on-screen. A conversation with a beginning, middle, and end beats an endless feed.",
  },
  {
    icon: <ShieldCheck className="size-5" />,
    title: "Privacy by default",
    color: "bg-nb-blue",
    desc: "Your data belongs to you. End-to-end encryption, no ad targeting, no selling personal data. Ever.",
  },
  {
    icon: <Lock className="size-5" />,
    title: "No algorithms",
    color: "bg-nb-purple",
    desc: "No algorithm sorting your friends, no engagement-maximizing tricks. Just the people you want to hear from.",
  },
  {
    icon: <Timer className="size-5" />,
    title: "Respect attention",
    color: "bg-nb-green",
    desc: "Fast, responsive, and honest about notifications. We respect your time the way we'd want ours respected.",
  },
  {
    icon: <Eye className="size-5" />,
    title: "Built in the open",
    color: "bg-nb-orange",
    desc: "Early access members shape the roadmap. We ship publicly, listen closely, and stay transparent about it.",
  },
];

const TIMELINE = [
  {
    year: "2025",
    title: "The idea",
    color: "bg-nb-blue",
    desc: "Tirbeo starts as a small team's answer to a simple question: what if social felt personal again?",
  },
  {
    year: "2026",
    title: "Early access",
    color: "bg-nb-yellow",
    desc: "The waitlist opens. Early believers shape the product — communities, threads, and live sessions take form.",
  },
  {
    year: "2027",
    title: "Public launch",
    color: "bg-nb-green",
    desc: "Tirbeo opens to everyone. Privacy-forward, community-first, and built to last.",
  },
];

const TEAM = [
  { name: "Claire Beaulieu", role: "CEO & Co-founder", initials: "CB", color: "bg-nb-yellow" },
  { name: "Daniel Roth", role: "CTO & Co-founder", initials: "DR", color: "bg-nb-blue" },
  { name: "Maya Lindqvist", role: "Head of Design", initials: "ML", color: "bg-nb-pink" },
  { name: "Aarav Sharma", role: "Head of Community", initials: "AS", color: "bg-nb-green" },
  { name: "Priya Nair", role: "Head of Trust & Safety", initials: "PN", color: "bg-nb-purple" },
  { name: "Liam O'Connor", role: "Lead Engineer", initials: "LO", color: "bg-nb-orange" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div
          className="absolute -left-14 top-8 size-36 rotate-12 border-2 border-foreground bg-nb-yellow"
          aria-hidden
        />
        <div
          className="absolute -right-12 bottom-8 size-44 -rotate-6 border-2 border-foreground bg-nb-pink/80"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center sm:py-28">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-brutal-sm"
          >
            <Sparkles className="size-3.5 text-nb-orange" />
            About Tirbeo
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="mt-6 text-5xl leading-[0.95] font-black uppercase tracking-tight sm:text-7xl"
          >
            Built different,
            <br />
            <span className="relative inline-block bg-nb-yellow px-3 shadow-brutal-sm">
              on purpose.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            Our mission is simple: create a platform where people connect
            because they genuinely want to — not because an algorithm tells
            them to.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Our mission
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Built different,
              <br />
              on purpose.
            </h2>
          </motion.div>
          <div className="flex flex-col gap-5 text-base leading-relaxed sm:text-lg">
            {MISSION.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
              >
                {p}
              </motion.p>
            ))}
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.4, ease: "easeOut" }}
              className="border-2 border-foreground bg-nb-yellow p-4 text-lg font-black uppercase tracking-tight shadow-brutal-sm"
            >
              "People connect because they genuinely want to — not because an
              algorithm tells them to."
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y-2 border-foreground bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Values
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              What we stand for.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="border-2 border-foreground bg-background shadow-brutal-sm transition-all duration-100 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal"
              >
                <div
                  className={`flex h-14 items-center border-b-2 border-foreground ${v.color}`}
                >
                  <span className="ml-4 flex size-9 items-center justify-center border-2 border-foreground bg-card shadow-brutal-sm">
                    {v.icon}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black uppercase tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Timeline
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
            From idea to launch.
          </h2>
        </motion.div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TIMELINE.map((t, i) => (
            <motion.div
              key={t.year}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="relative border-2 border-foreground bg-background shadow-brutal-sm"
            >
              <div
                className={`flex h-14 items-center border-b-2 border-foreground ${t.color}`}
              >
                <span className="ml-4 flex size-10 items-center justify-center border-2 border-foreground bg-card text-base font-black shadow-brutal-sm">
                  {t.year}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black uppercase tracking-tight">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-y-2 border-foreground bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Team
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              The early believers
              <br />
              behind it all.
            </h2>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="flex items-center gap-3 border-2 border-foreground bg-background p-4 shadow-brutal-sm transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal"
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center border-2 border-foreground text-sm font-black shadow-brutal-sm ${m.color}`}
                >
                  {m.initials}
                </span>
                <div className="leading-tight">
                  <p className="font-black uppercase tracking-wide">{m.name}</p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {m.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden border-2 border-foreground bg-nb-yellow px-6 py-12 text-center shadow-brutal-lg sm:px-12">
          <div
            className="absolute -top-8 -left-8 size-24 rotate-12 border-2 border-foreground bg-nb-blue"
            aria-hidden
          />
          <div
            className="absolute -right-8 -bottom-8 size-24 -rotate-12 border-2 border-foreground bg-nb-pink"
            aria-hidden
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Be an early believer.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium text-foreground/70">
              Join the waitlist and help shape the future of social — before
              the public launch.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                <a href="/#waitlist">
                  Join the waitlist <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
