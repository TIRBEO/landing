import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
};

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Tirbeo Collab", href: "https://collab.tirbeo.app" },
      { label: "Preview", href: "https://collab.tirbeo.app/preview" },
      { label: "Early Access", href: "#waitlist" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "About", href: "#about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Explore", href: "/explore" },
      { label: "Support", href: "https://support.tirbeo.app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "https://support.tirbeo.app/contact" },
      { label: "Privacy", href: "https://support.tirbeo.app/docs/privacy" },
      { label: "Terms", href: "https://support.tirbeo.app/docs/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-foreground text-background">
      {/* --------------------------------------------------------------- */}
      {/* CTA                                                             */}
      {/* --------------------------------------------------------------- */}

      <section className="border-b-2 border-background/20">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 border-2 border-background bg-nb-yellow px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground shadow-brutal-sm">
                <Sparkles className="size-3.5" />
                Building toward 2027
              </div>

              <h2 className="mt-7 text-5xl font-black uppercase leading-[0.82] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
                Be part of
                <br />
                what's next.
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-7 text-background/60 sm:text-base">
                Tirbeo is building technology for better conversations,
                communities, and collaboration. Join the early access list and
                follow what we're building.
              </p>
            </div>

            <motion.a
              href="#waitlist"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex w-full items-center justify-between gap-8 border-2 border-background bg-nb-yellow px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-foreground shadow-brutal-sm sm:w-auto"
            >
              Join the waitlist
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* MAIN FOOTER                                                     */}
      {/* --------------------------------------------------------------- */}

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1.9fr]">
          {/* Brand */}
          <div>
            <a
              href="#top"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex size-10 items-center justify-center overflow-hidden">
                <img
                  src="/logos.png"
                  alt="Tirbeo"
                  className="size-10 object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                />
              </span>

              <span className="text-xl font-black uppercase tracking-tight">
                Tirbeo
              </span>
            </a>

            <p className="mt-6 max-w-sm text-2xl font-black uppercase leading-tight">
              Technology that brings people closer.
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-background/50">
              A technology company exploring better ways for people to
              connect, create, collaborate, and build meaningful things
              together.
            </p>

            <a
              href="https://support.tirbeo.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 border-2 border-background bg-background px-4 py-2.5 text-xs font-black uppercase tracking-[0.25em] text-foreground transition-transform hover:-translate-y-1"
            >
              Support
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
            {COLUMNS.map((column, columnIndex) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: columnIndex * 0.08,
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-background/40">
                  {column.title}
                </p>

                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => {
                    const external = link.href.startsWith("http");

                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          {...(external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="group inline-flex items-center gap-1.5 text-sm font-medium text-background/75 transition-colors hover:text-nb-yellow"
                        >
                          {link.label}

                          {external && (
                            <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM                                                        */}
        {/* ------------------------------------------------------------- */}

        <div className="mt-16 border-t-2 border-background/15 pt-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-background/40">
                © 2026 Tirbeo. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-background/40">
              <a
                href="https://support.tirbeo.app/docs/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-nb-yellow"
              >
                Privacy
              </a>

              <a
                href="https://support.tirbeo.app/docs/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-nb-yellow"
              >
                Terms
              </a>

              <a
                href="https://support.tirbeo.app/docs/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-nb-yellow"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* BRAND TAPE                                                      */}
      {/* --------------------------------------------------------------- */}

      <div className="overflow-hidden border-t-2 border-background/20 bg-nb-yellow py-3 text-foreground">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max whitespace-nowrap"
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-8 px-4 text-[10px] font-black uppercase tracking-[0.35em]"
            >
              TIRBEO
              <span className="size-1.5 rounded-full bg-foreground" />
              BUILD WHAT'S NEXT
              <span className="size-1.5 rounded-full bg-foreground" />
              COMING 2027
              <span className="size-1.5 rounded-full bg-foreground" />
            </div>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}