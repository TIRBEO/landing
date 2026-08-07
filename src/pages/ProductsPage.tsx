import { motion, type Variants } from "framer-motion";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Code2,
  MessagesSquare,
  Minus,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

/* Staggered reveals for the comparison table rows. */
const tableContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const tableRow: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const PRODUCTS = [
  {
    number: "01",
    name: "Tirbeo",
    tag: "Live",
    tagClass: "bg-nb-green",
    icon: <MessagesSquare className="size-5" />,
    color: "bg-nb-blue",
    desc: "The community feed — threaded conversations, live sessions, and communities built for depth, private by default.",
    features: [
      "Threaded replies",
      "Live sessions & rooms",
      "Communities",
      "End-to-end encryption",
      "No algorithm",
    ],
  },
  {
    number: "02",
    name: "Tirbeo Collab",
    tag: "Coming soon",
    tagClass: "bg-nb-yellow",
    icon: <Users className="size-5" />,
    color: "bg-nb-pink",
    desc: "The full Tirbeo experience — shared libraries, team spaces, and collaboration that respects your attention.",
    features: [
      "Everything in Tirbeo",
      "Shared libraries",
      "Team spaces",
      "AI-assisted drafting",
      "Early access first",
    ],
  },
  {
    number: "03",
    name: "Tirbeo API",
    tag: "Coming soon",
    tagClass: "bg-nb-yellow",
    icon: <Code2 className="size-5" />,
    color: "bg-nb-purple",
    desc: "Bring Tirbeo into your own tools. Webhooks, full API access and docs — everything a developer needs.",
    features: [
      "REST & webhooks",
      "Full API access",
      "Developer docs",
      "Rate limits & keys",
      "Launch 2027",
    ],
  },
];

const COMPARISON: {
  feature: string;
  values: [boolean, boolean, boolean];
}[] = [
  { feature: "Threaded conversations", values: [true, true, false] },
  { feature: "Live sessions & rooms", values: [true, true, false] },
  { feature: "Communities", values: [true, true, false] },
  { feature: "Shared libraries", values: [false, true, false] },
  { feature: "AI-assisted drafting", values: [false, true, false] },
  { feature: "REST API & webhooks", values: [false, false, true] },
  { feature: "Privacy by default", values: [true, true, true] },
];

const STEPS = [
  {
    number: "01",
    title: "Join the waitlist",
    desc: "Add your email in seconds. Early access members get invitations ahead of the public launch.",
    color: "bg-nb-yellow",
  },
  {
    number: "02",
    title: "Shape the product",
    desc: "Share what you're building. Early believers help steer communities, threads, and features.",
    color: "bg-nb-pink",
  },
  {
    number: "03",
    title: "Launch with us",
    desc: "Get in first with exclusive features when Tirbeo opens publicly in 2027.",
    color: "bg-nb-green",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div
          className="absolute -left-14 top-8 size-36 rotate-12 border-2 border-foreground bg-nb-blue"
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
            Products
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="mt-6 text-5xl leading-[0.95] font-black uppercase tracking-tight sm:text-7xl"
          >
            One platform.
            <br />
            <span className="relative inline-block bg-nb-yellow px-3 shadow-brutal-sm">
              Every conversation.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            From the feed to the API — every way to connect on Tirbeo, in one
            place. Built for depth, private by default, and always
            community-first.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
            className="mt-8"
          >
            <Button asChild size="lg">
              <Link to="/#waitlist">
                Join the waitlist <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PRODUCTS */}
      {/* ================================================================ */}

      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {PRODUCTS.map((product) => (
              <motion.div
                key={product.number}
                variants={fadeUp}
                className="border-2 border-foreground bg-card p-8 shadow-brutal"
              >
                <div className={`inline-flex size-12 items-center justify-center border-2 border-foreground ${product.color} mb-6`}>
                  {product.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                  {product.tag}
                </span>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-tight">
                  {product.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-foreground/70">
                  {product.desc}
                </p>
                <ul className="mt-6 space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                      <Check className="size-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* COMPARISON */}
      {/* ================================================================ */}

      <section className="border-b-2 border-foreground bg-card">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h2 className="text-5xl font-black uppercase tracking-tight sm:text-7xl">
            Compare plans
          </h2>
          <div className="mt-12 overflow-hidden border-2 border-foreground">
            <table className="w-full text-left text-sm">
              <thead className="bg-foreground text-background">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em]">Feature</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em]">Tirbeo</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em]">Collab</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em]">API</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {COMPARISON.map(({ feature, values: [tirbeo, collab, api] }) => (
                  <tr key={feature} className="bg-background">
                    <td className="px-6 py-4 font-medium">{feature}</td>
                    <td className="px-6 py-4">
                      {tirbeo ? <Check className="size-5 text-nb-green" /> : <Minus className="size-5 text-muted-foreground" />}
                    </td>
                    <td className="px-6 py-4">
                      {collab ? <Check className="size-5 text-nb-green" /> : <Minus className="size-5 text-muted-foreground" />}
                    </td>
                    <td className="px-6 py-4">
                      {api ? <Check className="size-5 text-nb-green" /> : <Minus className="size-5 text-muted-foreground" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* STEPS */}
      {/* ================================================================ */}

      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border-2 border-foreground ${step.color} p-8 shadow-brutal`}
              >
                <span className="text-7xl font-black leading-none opacity-15">
                  {step.number}
                </span>
                <h3 className="mt-6 text-3xl font-black uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-foreground/70">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA */}
      {/* ================================================================ */}

      <section id="waitlist" className="border-b-2 border-foreground bg-nb-yellow">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em]">
                Coming soon
              </p>
              <h2 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl lg:text-8xl">
                Want to see
                <br />
                what&apos;s next?
              </h2>
              <p className="mt-7 max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
                Tirbeo is still being built. Join the waitlist to hear
                about early access and what&apos;s coming next.
              </p>
            </div>
            <Button
              asChild
              className="h-auto justify-between rounded-none border-2 border-foreground bg-foreground px-6 py-5 text-xs font-black uppercase tracking-[0.3em] text-background shadow-brutal-lg"
            >
              <Link to="/#waitlist">
                Join the waitlist
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
