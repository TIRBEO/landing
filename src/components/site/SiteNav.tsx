import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Principles", href: "#principles" },
  { label: "Future", href: "#future" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <style>{`
        @keyframes tirbeo-logo {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }

          25% {
            transform: scale(1.06) rotate(-3deg);
          }

          50% {
            transform: scale(0.97) rotate(3deg);
          }

          75% {
            transform: scale(1.05) rotate(-2deg);
          }
        }

        .tirbeo-logo-animation {
          animation: tirbeo-logo 2.8s ease-in-out infinite;
          transform-origin: center;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .tirbeo-logo-animation {
            animation: none;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b-2 border-foreground/10 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">

          {/* ============================================================ */}
          {/* LOGO                                                         */}
          {/* ============================================================ */}

          <a
            href="#top"
            aria-label="Tirbeo home"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="flex size-10 items-center justify-center overflow-hidden">
              <img
                src="/logos.png"
                alt="Tirbeo"
                className="tirbeo-logo-animation h-10 w-auto object-contain"
              />
            </div>

            <span className="text-sm font-black uppercase tracking-[0.3em]">
              Tirbeo
            </span>
          </a>

          {/* ============================================================ */}
          {/* DESKTOP NAV                                                  */}
          {/* ============================================================ */}

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="
                  relative
                  py-2
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-muted-foreground
                  transition-colors
                  hover:text-foreground
                "
              >
                {link.label}

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-0
                    bg-nb-yellow
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </a>
            ))}
          </nav>

          {/* ============================================================ */}
          {/* DESKTOP ACTIONS                                              */}
          {/* ============================================================ */}

          <div className="hidden items-center gap-2 md:flex">

            {/* Login */}
            <a
              href="https://accounts.tirbeo.app/login"
              target="_blank"
              rel="noopener noreferrer"
              className="
                border-2
                border-transparent
                px-3
                py-2
                text-[10px]
                font-black
                uppercase
                tracking-[0.25em]
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              Login
            </a>

            {/* Waitlist */}
            <motion.a
              href="#waitlist"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="
                group
                flex
                items-center
                gap-2
                border-2
                border-foreground
                bg-nb-yellow
                px-4
                py-2.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.25em]
                text-foreground
                shadow-brutal-sm
              "
            >
              Join Waitlist

              <ArrowRight
                className="
                  size-3.5
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              />
            </motion.a>
          </div>

          {/* ============================================================ */}
          {/* MOBILE BUTTON                                                */}
          {/* ============================================================ */}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="
              flex
              size-11
              items-center
              justify-center
              border-2
              border-foreground
              bg-card
              shadow-brutal-sm
              transition-transform
              active:translate-x-[1px]
              active:translate-y-[1px]
              md:hidden
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="size-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="size-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ============================================================ */}
        {/* MOBILE MENU                                                   */}
        {/* ============================================================ */}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden border-t-2 border-foreground bg-background md:hidden"
            >
              <nav className="mx-auto max-w-7xl px-4 py-5 sm:px-6">

                {/* Links */}
                <div className="flex flex-col">
                  {LINKS.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={closeMenu}
                      initial={{
                        opacity: 0,
                        x: -15,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.25,
                      }}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        border-b-2
                        border-foreground/10
                        py-4
                        text-sm
                        font-black
                        uppercase
                        tracking-[0.25em]
                        transition-colors
                        hover:text-nb-blue
                      "
                    >
                      <span>{link.label}</span>

                      <ChevronDown
                        className="
                          size-4
                          -rotate-90
                          opacity-40
                          transition-all
                          group-hover:translate-x-1
                          group-hover:opacity-100
                        "
                      />
                    </motion.a>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-5 grid grid-cols-2 gap-2">

                  <a
                    href="https://accounts.tirbeo.app/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-center
                      border-2
                      border-foreground
                      bg-card
                      px-4
                      py-3
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      shadow-brutal-sm
                    "
                  >
                    Login
                  </a>

                  <a
                    href="#waitlist"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      border-2
                      border-foreground
                      bg-nb-yellow
                      px-4
                      py-3
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      shadow-brutal-sm
                    "
                  >
                    Waitlist
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>

                {/* Small status */}
                <div className="mt-5 flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-nb-green" />

                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Building toward 2027
                  </span>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}