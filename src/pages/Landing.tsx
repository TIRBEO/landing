import { FormEvent, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers3,
  Lightbulb,
  Mail,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

import { motion } from "motion/react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const ease = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const JOURNEY = [
  {
    number: "01",
    year: "NOW",
    label: "THE IDEA",
    title: "Start with a question.",
    text: "What could technology look like if it was designed around people first?",
    side: "left",
    color: "bg-nb-yellow",
  },
  {
    number: "02",
    year: "EXPLORING",
    label: "THE WORK",
    title: "Explore what could exist.",
    text: "We investigate ideas, technologies, and opportunities that could become meaningful products and experiences.",
    side: "right",
    color: "bg-nb-blue",
  },
  {
    number: "03",
    year: "BUILDING",
    label: "THE PROCESS",
    title: "Turn possibility into reality.",
    text: "Ideas become prototypes. Prototypes become systems. We learn by making things real.",
    side: "left",
    color: "bg-nb-pink",
  },
  {
    number: "04",
    year: "2027",
    label: "THE NEXT CHAPTER",
    title: "Bring the work into the world.",
    text: "2027 marks a new chapter as Tirbeo begins turning its work into products, platforms, and companies.",
    side: "right",
    color: "bg-nb-green",
  },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Curiosity",
    text: "We start with questions. Better questions lead to better things.",
    icon: Lightbulb,
  },
  {
    number: "02",
    title: "People",
    text: "Technology matters because of what it enables people to do together.",
    icon: Users,
  },
  {
    number: "03",
    title: "Craft",
    text: "We care about the details, from the first idea to the final experience.",
    icon: Layers3,
  },
  {
    number: "04",
    title: "Long-term",
    text: "We're not trying to build everything at once. We're building something that lasts.",
    icon: Compass,
  },
];

/* -------------------------------------------------------------------------- */
/* REVEAL                                                                     */
/* -------------------------------------------------------------------------- */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative border-b-2 border-foreground bg-background">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-3 border-2 border-foreground bg-card px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-brutal-sm">
                <Sparkles className="size-4" />
                Independent technology company
              </span>

              <h1 className="mt-8 text-5xl font-black uppercase leading-tight sm:text-6xl lg:text-7xl">
                Make technology
                <br />
                <span className="relative inline-block">human.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Tirbeo builds people-first products and experiences — cleaner
                workspaces, clearer conversations, and private-by-default design.
              </p>

              <div className="mt-8 flex gap-4">
                <a className="inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-background shadow-brutal-sm" href="#early-access">
                  Join early access
                  <ArrowRight className="size-4" />
                </a>

                <a className="inline-flex items-center gap-3 border-2 border-foreground bg-card px-5 py-3 text-xs font-black uppercase tracking-[0.25em] text-foreground shadow-brutal-sm" href="#about">
                  Learn more
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-none border-2 border-foreground bg-card p-8 shadow-brutal-lg">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                What we ship
              </p>
              <h3 className="mt-4 text-2xl font-black uppercase">Focused tools for teams</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Clear spaces, contextual conversation, and controls you can trust.</p>
              <div className="mt-6 grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-nb-green">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-xs">Private-first</p>
                    <p className="text-sm text-muted-foreground">Spaces built to respect attention and privacy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-nb-yellow">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-xs">Contextual</p>
                    <p className="text-sm text-muted-foreground">Keep conversations grounded in people and projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* ABOUT                                                                      */
/* -------------------------------------------------------------------------- */

function About() {
  return (
    <section
      id="about"
      className="border-b-2 border-foreground bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">
          <Reveal>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                About Tirbeo
              </p>

              <div className="mt-6 h-2 w-20 bg-nb-yellow" />

              <p className="mt-7 max-w-xs text-sm leading-7 text-muted-foreground">
                A company in the making.
                <br />
                An idea becoming something real.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="text-4xl font-black uppercase leading-[0.88] tracking-tight sm:text-6xl lg:text-7xl">
                We build
                <br />
                <span className="text-muted-foreground">technology</span>
                <br />
                with purpose.
              </h2>

              <p className="mt-8 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                Tirbeo is an independent technology company exploring what
                comes next. We work across ideas, software, products, and
                experiences — looking for better ways to connect people,
                creativity, and technology.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid border-2 border-foreground sm:grid-cols-3">
          {[
            ["01", "Explore", "Find problems worth solving."],
            ["02", "Build", "Turn ideas into something tangible."],
            ["03", "Grow", "Build patiently for the long term."],
          ].map(([number, title, text], index) => (
            <Reveal key={number} delay={index * 0.08}>
              <div className="border-b-2 border-foreground p-7 last:border-b-0 sm:border-b-0 sm:border-r-2 sm:last:border-r-0">
                <span className="text-xs font-black text-muted-foreground">
                  {number}
                </span>

                <h3 className="mt-8 text-xl font-black uppercase">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* WORK                                                                       */
/* -------------------------------------------------------------------------- */

function Work() {
  return (
    <section
      id="work"
      className="border-b-2 border-foreground bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              What we're building
            </p>

            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.84] tracking-tight sm:text-7xl">
              More than
              <br />
              one idea.
            </h2>

            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Tirbeo is being built as a home for multiple ideas and
              technologies. Some will become products. Some will become
              experiments. The common thread is simple: build useful things
              that matter.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Technology",
              text: "Software and systems designed to make complex things simpler.",
              icon: Layers3,
            },
            {
              number: "02",
              title: "Connection",
              text: "Tools and experiences that help people communicate and collaborate.",
              icon: Users,
            },
            {
              number: "03",
              title: "Experiments",
              text: "New ideas worth exploring before they become something bigger.",
              icon: Sparkles,
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.number} delay={index * 0.08}>
                <motion.article
                  whileHover={{ y: -8 }}
                  className="group h-full border-2 border-foreground bg-background p-7 shadow-brutal-sm transition-shadow hover:shadow-brutal"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center border-2 border-foreground bg-nb-yellow shadow-brutal-sm">
                      <Icon className="size-5" />
                    </div>

                    <span className="text-xs font-black">{item.number}</span>
                  </div>

                  <h3 className="mt-12 text-2xl font-black uppercase">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {item.text}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]">
                    Tirbeo
                    <MoveRight className="size-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CURVED ROPE JOURNEY                                                        */
/* -------------------------------------------------------------------------- */

function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });

  const ropeScale = useTransform(progress, [0, 1], [0, 1]);

  /*
    This is the actual curved route.
    The rope moves left/right instead of simply going straight down.
  */
  const ropePath = `
    M 500 0
    C 500 100, 280 150, 300 290
    C 320 420, 700 430, 700 570
    C 700 720, 300 740, 300 880
    C 300 1020, 700 1040, 700 1190
    C 700 1320, 500 1380, 500 1500
  `;

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="overflow-hidden border-b-2 border-foreground bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              The journey
            </p>

            <h2 className="mt-5 text-5xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl lg:text-8xl">
              No straight
              <br />

              <span className="relative inline-block">
                path.
                <span className="absolute bottom-[-5px] left-0 h-2 w-full bg-nb-yellow" />
              </span>
            </h2>

            <p className="mt-8 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Tirbeo isn't following a predetermined roadmap. We're learning,
              building, changing, and moving forward as we go.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-24 lg:mt-32">
          {/* ================================================================ */}
          {/* DESKTOP CURVED ROPE                                              */}
          {/* ================================================================ */}

          <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1500px] lg:block">
            <svg
              viewBox="0 0 1000 1500"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {/* Rope shadow/base */}
              <path
                d={ropePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="32"
                strokeLinecap="round"
                className="text-foreground/10"
              />

              {/* Rope */}
              <path
                d={ropePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="2 16"
                className="text-foreground"
              />

              {/* inner rope highlight */}
              <path
                d={ropePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 13"
                className="text-background/80"
              />

              {/* Yellow animated path */}
              <motion.path
                d={ropePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength={1}
                style={{
                  pathLength: ropeScale,
                }}
                className="text-nb-yellow"
              />
            </svg>
          </div>

          {/* ================================================================ */}
          {/* MOBILE CURVED FEEL                                               */}
          {/* ================================================================ */}

          <div className="pointer-events-none absolute bottom-0 left-4 top-0 w-10 lg:hidden">
            <svg
              viewBox="0 0 40 1000"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="
                  M20 0
                  C20 100 7 140 20 240
                  C33 340 7 400 20 500
                  C33 600 7 680 20 780
                  C33 860 20 930 20 1000
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-foreground/10"
              />

              <motion.path
                d="
                  M20 0
                  C20 100 7 140 20 240
                  C33 340 7 400 20 500
                  C33 600 7 680 20 780
                  C33 860 20 930 20 1000
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                pathLength={1}
                style={{ pathLength: ropeScale }}
                className="text-nb-yellow"
              />
            </svg>
          </div>

          {/* ================================================================ */}
          {/* JOURNEY CARDS                                                    */}
          {/* ================================================================ */}

          <div className="relative space-y-20 sm:space-y-28 lg:space-y-32">
            {JOURNEY.map((item, index) => {
              const left = item.side === "left";

              return (
                <JourneyCard
                  key={item.number}
                  item={item}
                  index={index}
                  left={left}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* JOURNEY CARD                                                               */
/* -------------------------------------------------------------------------- */

function JourneyCard({
  item,
  index,
  left,
}: {
  item: (typeof JOURNEY)[number];
  index: number;
  left: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center 55%"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [60, 0, -10],
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [left ? -3 : 3, left ? 0.5 : -0.5, 0],
  );

  return (
    <div
      ref={ref}
      className={`relative min-h-[300px] ${
        left ? "lg:pr-[54%]" : "lg:pl-[54%]"
      }`}
    >
      {/* Connection from card to curved rope */}
      <div
        className={`pointer-events-none absolute top-12 hidden lg:block ${
          left ? "right-[44%]" : "left-[44%]"
        }`}
      >
        <div
          className={`h-[3px] w-24 bg-foreground ${
            left
              ? "origin-right -rotate-[10deg]"
              : "origin-left rotate-[10deg]"
          }`}
        />

        <div
          className={`absolute top-1/2 size-7 -translate-y-1/2 rotate-45 border-2 border-foreground bg-nb-yellow shadow-brutal-sm ${
            left ? "-left-1" : "-right-1"
          }`}
        />
      </div>

      {/* Central knot */}
      <div className="absolute left-1/2 top-8 z-30 hidden -translate-x-1/2 lg:block">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            stiffness: 190,
            damping: 15,
            delay: index * 0.08,
          }}
          className="size-12 border-2 border-foreground bg-background p-2 shadow-brutal"
        >
          <div className="size-full bg-nb-yellow" />
        </motion.div>
      </div>

      {/* Mobile marker */}
      <div className="absolute left-4 top-8 z-30 lg:hidden">
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="size-7 -translate-x-1/2 border-2 border-foreground bg-nb-yellow shadow-brutal-sm"
        />
      </div>

      <motion.article
        style={{ y, rotate }}
        whileHover={{
          y: -8,
          rotate: 0,
        }}
        transition={{ duration: 0.3, ease }}
        className="relative z-20 ml-10 lg:ml-0"
      >
        <div
          className={`overflow-hidden border-2 border-foreground ${item.color} p-7 shadow-brutal-lg sm:p-9`}
        >
          <div className="flex items-center justify-between">
            <span className="border-2 border-foreground bg-background px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] shadow-brutal-sm">
              {item.year}
            </span>

            <span className="text-xs font-black">{item.number}</span>
          </div>

          <p className="mt-8 text-[9px] font-black uppercase tracking-[0.3em]">
            {item.label}
          </p>

          <h3 className="mt-4 max-w-xl text-3xl font-black uppercase leading-[0.88] tracking-tight sm:text-5xl">
            {item.title}
          </h3>

          <p className="mt-5 max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
            {item.text}
          </p>

          <div className="mt-8 flex items-center justify-between border-t-2 border-foreground/20 pt-5">
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              TIRBEO / {item.number}
            </span>

            <ArrowRight className="size-4" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PRINCIPLES                                                                 */
/* -------------------------------------------------------------------------- */

function Principles() {
  return (
    <section
      id="principles"
      className="border-b-2 border-foreground bg-foreground text-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <Reveal>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-background/50">
            What guides us
          </p>

          <h2 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.84] tracking-tight sm:text-7xl">
            Build with
            <br />
            intention.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-px border border-background/20 bg-background/20 md:grid-cols-2">
          {PRINCIPLES.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.number} delay={index * 0.06}>
                <article className="h-full bg-foreground p-8 sm:p-10">
                  <div className="flex items-center justify-between">
                    <Icon className="size-6" />

                    <span className="text-xs font-black text-background/40">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-16 text-2xl font-black uppercase">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-background/60">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2027                                                                       */
/* -------------------------------------------------------------------------- */

function Future() {
  return (
    <section
      id="future"
      className="overflow-hidden border-b-2 border-foreground bg-nb-yellow"
    >
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <Reveal>
            <div>
              <span className="inline-flex border-2 border-foreground bg-background px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-brutal-sm">
                The next chapter
              </span>

              <h2 className="mt-8 text-[28vw] font-black leading-[0.7] tracking-[-0.1em] sm:text-[13rem]">
                2027
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div>
              <h3 className="text-4xl font-black uppercase leading-[0.88] sm:text-5xl">
                Something
                <br />
                real is coming.
              </h3>

              <p className="mt-7 text-sm leading-7 text-foreground/70 sm:text-base">
                2027 marks an important chapter for Tirbeo. It's when the work
                we've been exploring starts becoming visible to the world.
              </p>

              <a
                href="#early-access"
                className="group mt-8 inline-flex items-center gap-3 border-2 border-foreground bg-background px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-brutal-sm transition-all hover:-translate-y-1 hover:shadow-brutal"
              >
                Stay connected
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* EARLY ACCESS                                                               */
/* -------------------------------------------------------------------------- */

function EarlyAccess() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await submitWaitlist({ name, email, message });
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "/thanks";
      }, 900);
    } catch (err) {
      console.error("[EARLY-ACCESS]", err);
      setError("Something went wrong — please try again, or email us directly at support.tirbeo.app.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="early-access"
      className="border-b-2 border-foreground bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <div>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center border-2 border-foreground bg-nb-yellow shadow-brutal-sm">
                  <Mail className="size-4" />
                </span>

                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                  Stay connected
                </span>
              </div>

              <h2 className="mt-7 text-5xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl">
                Be part
                <br />
                of what's
                <br />
                <span className="relative inline-block">
                  next.
                  <span className="absolute bottom-0 left-0 -z-10 h-3 w-full bg-nb-yellow" />
                </span>
              </h2>

              <p className="mt-8 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                Want to hear what Tirbeo is working on? Leave your details and
                we'll keep you informed as the company takes shape.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Company updates",
                  "New projects and products",
                  "Important Tirbeo announcements",
                ].map((text) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-sm font-bold"
                  >
                    <span className="flex size-6 items-center justify-center border-2 border-foreground bg-nb-green">
                      <Check className="size-3" />
                    </span>

                    {text}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-2 border-foreground bg-background p-6 shadow-brutal-lg sm:p-9">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex size-20 items-center justify-center border-2 border-foreground bg-nb-green shadow-brutal">
                    <Check className="size-9" />
                  </div>

                  <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                    Received
                  </p>

                  <h3 className="mt-4 text-4xl font-black uppercase leading-[0.9] sm:text-5xl">
                    See you
                    <br />
                    soon.
                  </h3>

                  <p className="mt-5 text-sm text-muted-foreground">
                    Taking you to the confirmation page...
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Tirbeo / 2027
                      </p>

                      <h3 className="mt-3 text-3xl font-black uppercase">
                        Keep me posted.
                      </h3>
                    </div>

                    <Sparkles className="hidden size-7 sm:block" />
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                  >
                    {/* NAME */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em]"
                      >
                        Your name *
                      </label>

                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="h-14 w-full border-2 border-foreground bg-card px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:shadow-brutal-sm"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em]"
                      >
                        Email address *
                      </label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-14 w-full border-2 border-foreground bg-card pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:shadow-brutal-sm"
                        />
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          htmlFor="message"
                          className="text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                          Message
                        </label>

                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                          Optional
                        </span>
                      </div>

                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Anything you'd like to tell us?"
                        rows={5}
                        className="w-full resize-none border-2 border-foreground bg-card p-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground/50 focus:shadow-brutal-sm"
                      />
                    </div>

                    {error && (
                      <p
                        role="alert"
                        className="border-2 border-foreground bg-nb-pink/20 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex h-14 w-full items-center justify-between border-2 border-foreground bg-foreground px-5 text-xs font-black uppercase tracking-[0.3em] text-background shadow-brutal-sm transition-all hover:-translate-y-1 hover:shadow-brutal disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : "Send to Tirbeo"}

                      <Send className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="text-center text-[10px] leading-5 text-muted-foreground">
                      We only use your details to communicate about Tirbeo.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function Landing() {
  return (
    <div
      id="top"
      className="min-h-screen scroll-smooth bg-background text-foreground"
    >
      <SiteNav />

      <main>
        <Hero />
        <About />
        <Work />
        <Journey />
        <Principles />
        <Future />
        <EarlyAccess />
      </main>

      <SiteFooter />
    </div>
  );
}