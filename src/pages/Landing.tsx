import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AppPreview } from "@/components/landing/AppPreview";
import { Newsletter } from "@/components/landing/Newsletter";
import { Testimonials } from "@/components/landing/Testimonials";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  ArrowRight,
  Lock,
  MessageSquare,
  Radio,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function Marquee({ items, fast }: { items: string[]; fast?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y-2 border-foreground bg-foreground py-3 text-background">
      <div
        className={
          "flex w-max gap-8 whitespace-nowrap " +
          (fast ? "animate-marquee-fast" : "animate-marquee")
        }
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-sm font-black uppercase tracking-widest"
          >
            {item}
            <Sparkles className="size-4 text-nb-yellow" />
          </span>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <MessageSquare className="size-6" />,
    title: "Threads with depth",
    color: "bg-nb-blue",
    desc: "Every conversation has a beginning, middle, and end. Follow threads that read like real conversation — no endless scrolling, ever.",
  },
  {
    icon: <Sparkles className="size-6" />,
    title: "AI that sounds like you",
    color: "bg-nb-purple",
    desc: "Draft replies in one click. Tirbeo's AI reads the whole thread and writes words that sound like you — edit, send, done.",
  },
  {
    icon: <Radio className="size-6" />,
    title: "Rooms, not stadiums",
    color: "bg-nb-pink",
    desc: "Real-time rooms capped for genuine connection. Show up, go deep, and leave feeling heard — not just seen.",
  },
  {
    icon: <Lock className="size-6" />,
    title: "Private by design",
    color: "bg-nb-green",
    desc: "End-to-end encrypted messages and a feed that stays yours. No algorithm sorting your friends. Ever.",
  },
];

// Alternating tilt per card — cards straighten out on hover.
const TILTS = [
  "rotate-[-1.5deg]",
  "rotate-[1.5deg]",
  "rotate-[-1deg]",
  "rotate-[1deg]",
];

const ABOUT_PARAGRAPHS = [
  "Tirbeo is built to make social networking feel personal again. We believe the best online experiences come from genuine conversations, shared interests, and communities where people feel welcome.",
  "Instead of endless scrolling, our platform encourages meaningful interactions that create real value and lasting connections. Every feature is designed with people in mind.",
  "Whether you're discovering local communities, meeting like-minded individuals, or sharing your ideas with the world, Tirbeo provides a clean, distraction-free space where authentic conversations can naturally grow.",
  "We prioritize privacy, performance, and simplicity. From secure messaging and modern technology to a fast, responsive experience across every device, Tirbeo is built to be reliable, intuitive, and respectful of your time and attention.",
];

const FAQS = [
  {
    q: "What is Tirbeo?",
    a: "Tirbeo is a community-first platform designed for meaningful conversations, thoughtful discovery, and privacy-forward connections. We're launching publicly in 2027.",
  },
  {
    q: "How do I get early access?",
    a: "Join the waitlist with your email above. Early access members will receive invitations ahead of the public launch with exclusive features.",
  },
  {
    q: "Is my data private?",
    a: "Your data belongs to you. We never sell personal data to advertisers, we store only what's necessary, and we provide full transparency and control over your information at all times.",
  },
  {
    q: "What makes Tirbeo different?",
    a: "No algorithm sorting your friends, no endless notifications, no noise. Just real conversations with people you want to hear from — threaded, private by default, and built for depth.",
  },
  {
    q: "When is the public launch?",
    a: "Tirbeo launches publicly in 2027. Early access members get in first with exclusive features, so don't miss the waitlist.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute top-10 -left-16 size-40 rotate-12 border-2 border-foreground bg-nb-yellow"
          aria-hidden
        />
        <div
          className="absolute -right-10 bottom-16 size-52 rotate-6 border-2 border-foreground bg-nb-pink/80"
          aria-hidden
        />
        <div
          className="absolute top-24 right-[12%] size-16 -rotate-12 border-2 border-foreground bg-nb-blue/70"
          aria-hidden
        />
        <div
          className="absolute bottom-24 left-[10%] size-14 rotate-12 border-2 border-foreground bg-nb-green/70"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-24 pb-16 text-center sm:pt-36 sm:pb-24">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-brutal-sm"
          >
            <Sparkles className="size-3.5 text-nb-orange" />
            Build the future of social — launching 2027
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="mt-6 text-5xl leading-[0.95] font-black uppercase tracking-tight sm:text-7xl lg:text-8xl"
          >
            A new way to
            <br />
            <span className="relative inline-block bg-nb-yellow px-3 shadow-brutal-sm">
              connect
            </span>
            , create
            <br />
            and belong.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            A new way to connect, create and belong — a community-first
            platform for meaningful conversations, thoughtful discovery, and
            privacy-forward connections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            className="mt-8"
          >
            <Button asChild size="lg">
              <a href="#waitlist">
                Join the waitlist <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>

          <a
            href="#preview"
            className="mt-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Scroll
            <span className="inline-block animate-bounce">↓</span>
          </a>
        </div>
      </section>

      <Marquee
        fast
        items={["Create", "Belong", "Communities", "No Algorithms", "Connect"]}
      />

      {/* Preview caption */}
      <section id="preview" className="mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            A peek at the app
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Your feed, communities
            <br />
            and conversations.
          </h2>
        </motion.div>
        <motion.div {...fadeUp} className="mt-10">
          <AppPreview />
        </motion.div>
      </section>

      <Marquee fast items={["Threaded", "Private", "Live", "Built for depth"]} />

      {/* About */}
      <section id="about" className="mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              About
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Built different,
              <br />
              on purpose.
            </h2>
          </div>
          <div className="flex flex-col gap-5 text-base leading-relaxed sm:text-lg">
            {ABOUT_PARAGRAPHS.map((p, i) => (
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
              "Our mission is simple: create a platform where people connect
              because they genuinely want to — not because an algorithm tells
              them to."
            </motion.blockquote>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="border-y-2 border-foreground bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Motion in motion
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Conversations that
              <br />
              feel human.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Built for depth — meaningful threads, AI drafting, live rooms,
              and a clean focused interface. No noise, no endless
              notifications. Just real conversations with people you want to
              hear from.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className={`group border-2 border-foreground bg-background shadow-brutal-sm transition-all duration-150 ${TILTS[i % TILTS.length]} hover:rotate-0 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal`}
              >
                <div className={`flex h-14 items-center border-b-2 border-foreground ${f.color}`}>
                  <span className="ml-4 flex size-9 items-center justify-center border-2 border-foreground bg-card shadow-brutal-sm">
                    {f.icon}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black uppercase tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Products teaser */}
      <section id="products" className="mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Products
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              One platform.
              <br />
              Every conversation.
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/products">
              Explore all products <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="relative mt-10 overflow-hidden border-2 border-foreground bg-card shadow-brutal-lg"
        >
          <div className="grid items-stretch md:grid-cols-[1fr_240px]">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center border-2 border-foreground bg-nb-yellow text-lg font-black shadow-brutal-sm">
                  01
                </span>
                <span className="border-2 border-foreground bg-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-background">
                  Coming soon
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                Tirbeo Collab
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                The full Tirbeo experience — threaded conversations, live
                sessions, and communities that respect your attention. Built
                for depth, private by default, and launching with early access.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Threaded replies", "Live sessions", "Communities", "Private by default"].map((t) => (
                  <span
                    key={t}
                    className="border-2 border-foreground bg-background px-2.5 py-1 text-[11px] font-black uppercase tracking-wide shadow-brutal-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3 border-t-2 border-foreground bg-nb-green p-6 md:border-t-0 md:border-l-2">
              <p className="text-sm font-black uppercase tracking-wide">
                Want in first?
              </p>
              <p className="text-xs leading-relaxed text-foreground/70">
                Early access members get invitations ahead of the public
                launch with exclusive features.
              </p>
              <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                <a href="#waitlist">Join the waitlist</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-20">
        <motion.div {...fadeUp} className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Documents
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Frequently asked.
          </h2>
        </motion.div>
        <motion.div {...fadeUp} className="mt-10 flex flex-col gap-3">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {FAQS.map((f) => (
              <AccordionItem
                key={f.q}
                value={f.q}
                className="border-2 border-foreground bg-card px-5 shadow-brutal-sm"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-black uppercase tracking-wide hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      <Newsletter />

      <SiteFooter />
    </div>
  );
}
