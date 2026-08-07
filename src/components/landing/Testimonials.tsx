import { cn } from "@/lib/utils";
import { Quote, ArrowRight } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The targeting precision and community depth on Tirbeo is exactly what marketing needs today. We're all in.",
    name: "Claire Beaulieu",
    role: "CMO",
    initials: "CB",
  },
  {
    quote:
      "We found Tirbeo months before launch and the early community already feels more real than anything on legacy social.",
    name: "Daniel Roth",
    role: "Partner",
    initials: "DR",
  },
  {
    quote:
      "The threaded discussions blow Discord away. No noise, just real conversations with a beginning, middle, and end.",
    name: "Maya Lindqvist",
    role: "Designer",
    initials: "ML",
  },
  {
    quote:
      "Shared libraries I actually own — I saved three posts and carried them straight into another community. That's the future.",
    name: "Aarav Sharma",
    role: "Creator",
    initials: "AS",
  },
  {
    quote:
      "Live sessions capped for real connection, not crowds. We booked Friday and it felt like a room, not a stadium.",
    name: "Priya Nair",
    role: "Community Lead",
    initials: "PN",
  },
  {
    quote:
      "Privacy by default changed how our team talks. Every message sealed, only who we chose can read it.",
    name: "Liam O'Connor",
    role: "Founder",
    initials: "LO",
  },
  {
    quote:
      "Finally a platform that respects my attention. No algorithm sorting my friends. Just the people I want to hear from.",
    name: "Sofia Marchetti",
    role: "Writer",
    initials: "SM",
  },
  {
    quote:
      "We moved our whole studio into Tirbeo Collab. The focused interface keeps the work front and center, not the noise.",
    name: "Noah Bergström",
    role: "Director",
    initials: "NB",
  },
  {
    quote:
      "I left three other apps in a week. Tirbeo is the only feed where I actually know everyone I'm talking to.",
    name: "Hana Kim",
    role: "Product Designer",
    initials: "HK",
  },
  {
    quote:
      "The live rooms feel intimate even at 40 people. Conversations breathe instead of getting buried in a feed.",
    name: "Marcus Webb",
    role: "Indie Hacker",
    initials: "MW",
  },
  {
    quote:
      "Saved a whole research thread to my library and reused it in two communities. That portability is unreal.",
    name: "Yuki Tanaka",
    role: "Researcher",
    initials: "YT",
  },
];

const ACCENTS = [
  "bg-[#ffd83d]",
  "bg-[#79a9ef]",
  "bg-[#71d99b]",
  "bg-[#f47fa5]",
];

function Card({
  t,
  index,
}: {
  t: Testimonial;
  index: number;
}) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <figure
      className={cn(
        "group relative w-[310px] shrink-0",
        "border-2 border-[#171612]",
        "bg-[#fffdf7]",
        "p-5",
        "shadow-[4px_4px_0_#171612]",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-[6px_6px_0_#171612]",
        "sm:w-[340px]",
      )}
    >
      {/* Accent strip */}
      <div className={cn("absolute left-0 top-0 h-1.5 w-full", accent)} />

      {/* Quote icon */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex size-9 items-center justify-center",
            "border-2 border-[#171612]",
            accent,
          )}
        >
          <Quote className="size-4 rotate-180 text-[#171612]" />
        </div>

        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#77736a]">
          Tirbeo
        </span>
      </div>

      {/* Quote */}
      <blockquote className="mt-5 min-h-[115px] text-[14px] font-semibold leading-6 tracking-[-0.01em] text-[#171612]">
        “{t.quote}”
      </blockquote>

      {/* Person */}
      <figcaption className="mt-5 flex items-center gap-3 border-t-2 border-[#171612] pt-4">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center",
            "border-2 border-[#171612]",
            "text-[10px] font-black",
            accent,
          )}
        >
          {t.initials}
        </span>

        <div className="min-w-0 leading-tight">
          <p className="truncate text-xs font-black uppercase tracking-wide">
            {t.name}
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#77736a]">
            {t.role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

function Row({
  items,
  reverse,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f5f1e8] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f5f1e8] to-transparent" />

      <div
        className={cn(
          "flex w-max gap-6 px-3",
          reverse
            ? "animate-marquee-fast [animation-direction:reverse]"
            : "animate-marquee",
        )}
      >
        {doubled.map((t, i) => (
          <Card
            key={`${t.name}-${i}`}
            t={t}
            index={i % items.length}
          />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const half = Math.ceil(TESTIMONIALS.length / 2);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-y-2 border-[#171612] bg-[#f5f1e8] py-20 text-[#171612] sm:py-24"
    >
      {/* Decorative shapes */}

      <div className="pointer-events-none absolute -left-16 top-28 hidden h-28 w-28 rotate-[12deg] border-2 border-[#171612] bg-[#ffd83d] lg:block" />

      <div className="pointer-events-none absolute -right-12 bottom-24 hidden h-36 w-36 rotate-[-8deg] border-2 border-[#171612] bg-[#f47fa5] lg:block" />

      <div className="pointer-events-none absolute right-[8%] top-16 hidden size-14 rotate-[8deg] border-2 border-[#171612] bg-[#79a9ef] lg:block" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative z-10 mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2 border-2 border-[#171612] bg-white px-4 py-2 shadow-[3px_3px_0_#171612]">
              <span className="text-sm text-[#ffb800]">✦</span>

              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Trusted feedback
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-4xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              PEOPLE ARE
              <br />

              <span className="relative inline-block">
                <span className="relative z-10">TALKING.</span>

                <span className="absolute bottom-0 left-0 right-0 z-0 h-3 bg-[#ffd83d] sm:h-5" />
              </span>

              <br />

              AND WE'RE LISTENING.
            </h2>
          </div>

          <p className="max-w-sm text-sm font-medium leading-6 text-[#69665d] sm:text-base lg:pb-1">
            Leaders, creators, builders, and community members sharing why
            Tirbeo feels different.
          </p>
        </div>
      </div>

      {/* Testimonial rows */}
      <div className="relative z-10 flex flex-col gap-7">
        <Row items={TESTIMONIALS.slice(0, half)} />
        <Row items={TESTIMONIALS.slice(half)} reverse />
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-2 border-[#171612] bg-[#fffdf7] p-5 shadow-[5px_5px_0_#171612] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#77736a]">
              Want to be part of it?
            </p>

            <p className="mt-2 text-lg font-black uppercase tracking-tight sm:text-xl">
              Your voice belongs here.
            </p>
          </div>

          <a
            href="#waitlist"
            className="group flex w-fit items-center gap-3 border-2 border-[#171612] bg-[#171612] px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white shadow-[3px_3px_0_#ffd83d] transition-all duration-150 hover:-translate-y-1"
          >
            Join Tirbeo

            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}