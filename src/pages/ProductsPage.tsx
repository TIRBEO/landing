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
    

[FILE_TOO_LARGE]: The combined read_files output exceeded the 1,00,000 character hard limit. This file was truncated after 5,722 characters. Read it separately or use code_search for the relevant section.