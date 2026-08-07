import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lock,
  MessageCircle,
  Users,
  Zap,
} from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Create your space.",
    description:
      "Start with a private space for the people, projects, or communities that matter to you.",
    icon: Users,
    color: "bg-nb-yellow",
  },
  {
    number: "02",
    title: "Start the conversation.",
    description:
      "Keep conversations organized with context that makes it easier to understand what's happening.",
    icon: MessageCircle,
    color: "bg-nb-blue",
  },
  {
    number: "03",
    title: "Build together.",
    description:
      "Move from conversation to collaboration without losing the people and context behind the work.",
    icon: Zap,
    color: "bg-nb-pink",
  },
];

const PRINCIPLES = [
  "Private spaces",
  "Clear conversations",
  "Intentional discovery",
  "Human-first interaction",
];

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.7,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteNav />

      <main>
        {/* ================================================================ */}
        {/* HERO */}
        {/* ================================================================ */}

        <section className="relative overflow-hidden border-b-2 border-foreground">
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Floating shape */}
          <motion.div
            animate={{
              y: [0, -16, 0],
              rotate: [5, 10, 5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[8%] top-32 hidden size-24 border-2 border-foreground bg-nb-yellow shadow-brutal md:block"
          />

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [-5, -10, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-[8%] hidden size-14 border-2 border-foreground bg-nb-blue shadow-brutal md:block"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="max-w-5xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-brutal-sm">
                  <span className="size-2 animate-pulse rounded-full bg-nb-green" />
                  How Tirbeo works
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-8 text-[14vw] font-black uppercase leading-[0.78] tracking-[-0.07em] sm:text-[8rem] lg:text-[9.5rem]">
                  Less
                  <br />
                  <span className="bg-nb-yellow px-3 shadow-brutal">
                    noise.
                  </span>
                  <br />
                  More meaning.
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Tirbeo is designed around a simple idea: people should be
                    able to communicate, collaborate, and build together
                    without getting buried in noise.
                  </p>

                  <Button
                    asChild
                    className="h-auto justify-between rounded-none border-2 border-foreground bg-foreground px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-background shadow-brutal-sm transition-transform hover:-translate-y-1 hover:bg-foreground"
                  >
                    <a href="#steps">
                      See how it works
                      <ArrowDown className="size-4" />
                    </a>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SIMPLE EXPLANATION */}
        {/* ================================================================ */}

        <section className="border-b-2 border-foreground">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
              <Reveal>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
                    The idea
                  </p>

                  <div className="mt-6 h-2 w-20 bg-nb-yellow" />

                  <p className="mt-6 max-w-xs text-sm leading-7 text-muted-foreground">
                    Simple tools. Clear spaces. Better conversations.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                  Put people
                  <br />
                  <span className="text-muted-foreground">
                    before the
                  </span>
                  <br />
                  platform.
                </h2>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* STEPS */}
        {/* ================================================================ */}

        <section
          id="steps"
          className="border-b-2 border-foreground bg-card"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <Reveal>
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
                  Three simple steps
                </p>

                <h2 className="mt-5 text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl">
                  From idea
                  <br />
                  <span className="bg-nb-blue px-3 shadow-brutal-sm">
                    to action.
                  </span>
                </h2>
              </div>
            </Reveal>

            {/* Vertical timeline */}
            <div className="relative mt-20">
              {/* Rope */}
              <div className="absolute bottom-10 left-5 top-10 w-[3px] bg-foreground/15 md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-12 md:space-y-24">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isLeft = index % 2 === 0;

                  return (
                    <Reveal
                      key={step.number}
                      delay={index * 0.1}
                    >
                      <div className="relative grid md:grid-cols-2">
                        {/* Timeline marker */}
                        <div className="absolute left-5 top-8 z-20 -translate-x-1/2 md:left-1/2">
                          <motion.div
                            whileInView={{
                              scale: [0.5, 1.15, 1],
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: index * 0.1,
                            }}
                            className="size-5 border-2 border-foreground bg-nb-yellow shadow-brutal-sm"
                          />
                        </div>

                        <div
                          className={`ml-12 md:ml-0 ${
                            isLeft
                              ? "md:pr-20"
                              : "md:col-start-2 md:pl-20"
                          }`}
                        >
                          <motion.article
                            whileHover={{
                              y: -8,
                              rotate: isLeft ? -1 : 1,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className={`border-2 border-foreground ${step.color} p-7 shadow-brutal-lg sm:p-9`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-7xl font-black leading-none opacity-15">
                                {step.number}
                              </span>

                              <div className="border-2 border-foreground bg-background p-3 shadow-brutal-sm">
                                <Icon className="size-5" />
                              </div>
                            </div>

                            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.35em]">
                              Step {step.number}
                            </p>

                            <h3 className="mt-4 text-3xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl">
                              {step.title}
                            </h3>

                            <p className="mt-5 max-w-xl text-sm leading-7 text-foreground/70">
                              {step.description}
                            </p>

                            <div className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]">
                              Tirbeo
                              <span className="h-[2px] w-10 bg-foreground" />
                              {step.number}
                            </div>
                          </motion.article>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* PRINCIPLES */}
        {/* ================================================================ */}

        <section className="border-b-2 border-foreground bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
              <Reveal>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-background/50">
                    What stays constant
                  </p>

                  <div className="mt-6 h-2 w-20 bg-nb-yellow" />

                  <p className="mt-7 max-w-xs text-sm leading-7 text-background/50">
                    The product can evolve. The principles don't have to.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div>
                  <h2 className="text-4xl font-black uppercase leading-[0.9] sm:text-6xl">
                    Designed for
                    <br />
                    <span className="text-nb-yellow">
                      intentional connection.
                    </span>
                  </h2>

                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    {PRINCIPLES.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{
                          opacity: 0,
                          x: index % 2 === 0 ? -20 : 20,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.08,
                          ease,
                        }}
                        className="flex items-center gap-3 border-2 border-background/30 px-5 py-4"
                      >
                        <div className="flex size-6 shrink-0 items-center justify-center bg-nb-yellow text-foreground">
                          <Check className="size-4" />
                        </div>

                        <span className="text-xs font-black uppercase tracking-[0.15em]">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* LIVE / PRIVACY */}
        {/* ================================================================ */}

        <section className="border-b-2 border-foreground">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="h-full border-2 border-foreground bg-nb-yellow p-8 shadow-brutal-sm"
                >
                  <Lock className="size-7" />

                  <h3 className="mt-10 text-3xl font-black uppercase leading-none">
                    Private spaces.
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-foreground/70">
                    Communities and workspaces are designed around controlled
                    access and intentional participation.
                  </p>
                </motion.div>
              </Reveal>

              <Reveal delay={0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="h-full border-2 border-foreground bg-nb-pink p-8 shadow-brutal-sm"
                >
                  <MessageCircle className="size-7" />

                  <h3 className="mt-10 text-3xl font-black uppercase leading-none">
                    Conversations
                    <br />
                    with context.
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-foreground/70">
                    The goal isn't more messages. It's making the right
                    conversations easier to understand and act on.
                  </p>
                </motion.div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CTA */}
        {/* ================================================================ */}

        <section
          id="waitlist"
          className="border-b-2 border-foreground bg-nb-yellow"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_0.5fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em]">
                    Coming soon
                  </p>

                  <h2 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl lg:text-8xl">
                    Want to see
                    <br />
                    what's next?
                  </h2>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
                    Tirbeo is still being built. Join the waitlist to hear
                    about early access and what's coming next.
                  </p>
                </div>

                <Button
                  asChild
                  className="h-auto justify-between rounded-none border-2 border-foreground bg-foreground px-6 py-5 text-xs font-black uppercase tracking-[0.3em] text-background shadow-brutal-lg transition-transform hover:-translate-y-1 hover:bg-foreground"
                >
                  <a href="/#waitlist">
                    Join the waitlist
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}