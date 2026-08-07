import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  MessageCircle,
  Users,
  Sparkles,
} from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    number: "01",
    title: "Private by default.",
    text: "Spaces designed around trust, context, and meaningful interaction.",
    icon: Lock,
    className: "bg-nb-yellow",
  },
  {
    number: "02",
    title: "Conversations with context.",
    text: "Keep discussions organized, focused, and easier to follow.",
    icon: MessageCircle,
    className: "bg-nb-blue",
  },
  {
    number: "03",
    title: "Built around people.",
    text: "Communities and teams should feel human instead of overwhelming.",
    icon: Users,
    className: "bg-nb-pink",
  },
];

const ROADMAP = [
  {
    label: "NOW",
    title: "Early access",
    text: "Building the foundation and inviting the first people into Tirbeo.",
  },
  {
    label: "NEXT",
    title: "More ways to connect",
    text: "Expanding communities, collaboration, and team experiences.",
  },
  {
    label: "2027",
    title: "The next chapter",
    text: "Bringing more of Tirbeo's products and ideas into the world.",
  },
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
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

export default function Explore() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteNav />

      <main>
        {/* HERO */}
        <section className="relative border-b-2 border-foreground">
          {/* subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* floating shapes */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [4, 9, 4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[8%] top-28 hidden size-20 border-2 border-foreground bg-nb-yellow shadow-brutal md:block"
          />

          <motion.div
            animate={{
              y: [0, 18, 0],
              rotate: [-5, -10, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-[7%] hidden size-14 border-2 border-foreground bg-nb-blue shadow-brutal md:block"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="max-w-5xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-brutal-sm">
                  <Sparkles className="size-3.5" />
                  Explore Tirbeo
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-8 max-w-5xl text-[15vw] font-black uppercase leading-[0.78] tracking-[-0.07em] sm:text-[9rem] lg:text-[10rem]">
                  Discover
                  <br />
                  <span className="inline-block bg-nb-yellow px-3 pb-2 shadow-brutal">
                    what's
                  </span>
                  <br />
                  next.
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Tirbeo is exploring a different way to build technology —
                    one centered around people, trust, context, and meaningful
                    connection.
                  </p>

                  <Button
                    asChild
                    className="h-auto justify-between rounded-none border-2 border-foreground bg-foreground px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-background shadow-brutal-sm hover:-translate-y-1 hover:bg-foreground"
                  >
                    <a href="/#waitlist">
                      Join the waitlist
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="border-b-2 border-foreground">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
              <Reveal>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
                    Our direction
                  </p>

                  <div className="mt-6 h-2 w-20 bg-nb-yellow" />

                  <p className="mt-6 max-w-xs text-sm leading-7 text-muted-foreground">
                    Technology should help people do more together — without
                    creating more noise.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div>
                  <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
                    Technology
                    <br />
                    <span className="text-muted-foreground">
                      should feel
                    </span>
                    <br />
                    human.
                  </h2>

                  <p className="mt-8 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    We're not trying to build another place that demands
                    attention. We're exploring products where people can
                    communicate, collaborate, and create with more clarity.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-b-2 border-foreground bg-card">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <Reveal>
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
                  What matters
                </p>

                <h2 className="mt-5 text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl">
                  Built with
                  <br />
                  <span className="bg-nb-blue px-3 shadow-brutal-sm">
                    intention.
                  </span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {FEATURES.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Reveal key={item.number} delay={index * 0.08}>
                    <motion.article
                      whileHover={{
                        y: -10,
                        rotate: index === 0 ? -1 : index === 1 ? 0 : 1,
                      }}
                      transition={{ duration: 0.25 }}
                      className={`h-full border-2 border-foreground ${item.className} p-7 shadow-brutal-sm`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-6xl font-black leading-none opacity-15">
                          {item.number}
                        </span>

                        <Icon className="size-6" />
                      </div>

                      <h3 className="mt-16 text-2xl font-black uppercase leading-none">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-foreground/70">
                        {item.text}
                      </p>
                    </motion.article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUCT */}
        <section className="border-b-2 border-foreground bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <Reveal>
                <div>
                  <div className="inline-flex border-2 border-background bg-nb-yellow px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
                    First product
                  </div>

                  <h2 className="mt-7 text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl">
                    Tirbeo
                    <br />
                    Collab.
                  </h2>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-background/60 sm:text-base">
                    A collaboration experience designed for focused
                    communities, teams, and conversations.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="border-2 border-background bg-background p-1 shadow-brutal-lg">
                  <div className="bg-nb-yellow p-7 text-foreground sm:p-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Product direction
                    </p>

                    <h3 className="mt-6 text-3xl font-black uppercase leading-[0.9] sm:text-5xl">
                      Less noise.
                      <br />
                      More context.
                    </h3>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {[
                        "Private spaces",
                        "Structured conversations",
                        "Team collaboration",
                        "Human-first design",
                      ].map((feature) => (
                        <div
                          key={feature}
                          className="border-2 border-foreground bg-background px-4 py-3 text-xs font-black uppercase tracking-wide"
                        >
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ROADMAP */}
        <section className="border-b-2 border-foreground">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <Reveal>
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">
                  The roadmap
                </p>

                <h2 className="mt-5 text-5xl font-black uppercase leading-[0.85] tracking-tight sm:text-7xl">
                  We're building
                  <br />
                  <span className="text-muted-foreground">as we go.</span>
                </h2>
              </div>
            </Reveal>

            <div className="relative mt-20">
              {/* rope */}
              <div className="absolute bottom-0 left-5 top-0 w-1 rounded-full bg-foreground/10 md:left-1/2 md:-translate-x-1/2" />

              <div className="space-y-12">
                {ROADMAP.map((item, index) => (
                  <Reveal key={item.label} delay={index * 0.1}>
                    <div
                      className={`relative grid gap-8 md:grid-cols-2 md:gap-20 ${
                        index % 2 === 0
                          ? "md:text-right"
                          : "md:text-left"
                      }`}
                    >
                      {/* marker */}
                      <div className="absolute left-5 top-8 z-10 size-4 -translate-x-1/2 border-2 border-foreground bg-nb-yellow md:left-1/2" />

                      <div
                        className={
                          index % 2 === 0
                            ? "ml-12 md:ml-0 md:pr-20"
                            : "ml-12 md:col-start-2 md:ml-0 md:pl-20"
                        }
                      >
                        <div className="border-2 border-foreground bg-card p-7 shadow-brutal-sm">
                          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                            {item.label}
                          </span>

                          <h3 className="mt-4 text-2xl font-black uppercase sm:text-3xl">
                            {item.title}
                          </h3>

                          <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="waitlist"
          className="border-b-2 border-foreground bg-nb-yellow"
        >
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <Reveal>
              <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.4em]">
                    Early access
                  </p>

                  <h2 className="mt-6 text-5xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl">
                    Be there
                    <br />
                    early.
                  </h2>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
                    Join the Tirbeo waitlist and be among the first to hear
                    when we're ready to open the doors.
                  </p>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                  className="border-2 border-foreground bg-background p-5 shadow-brutal-lg sm:p-7"
                >
                  <label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="mt-3 h-14 w-full border-2 border-foreground bg-card px-4 text-sm font-medium outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-foreground"
                  />

                  <label
                    htmlFor="message"
                    className="mt-5 block text-[10px] font-black uppercase tracking-[0.3em]"
                  >
                    Optional message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="What are you excited about?"
                    className="mt-3 w-full resize-none border-2 border-foreground bg-card p-4 text-sm font-medium outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-foreground"
                  />

                  <Button
                    type="submit"
                    className="mt-4 h-14 w-full rounded-none border-2 border-foreground bg-foreground text-xs font-black uppercase tracking-[0.3em] text-background shadow-brutal-sm hover:bg-foreground/90"
                  >
                    Join the waitlist
                    <ArrowRight className="ml-2 size-4" />
                  </Button>

                  <p className="mt-4 text-center text-[10px] leading-5 text-muted-foreground">
                    No spam. Just important Tirbeo updates.
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* BACK */}
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Button
              asChild
              variant="outline"
              className="rounded-none border-2 border-foreground shadow-brutal-sm"
            >
              <a href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back home
              </a>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}