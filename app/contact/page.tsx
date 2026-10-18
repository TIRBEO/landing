import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Mail, ShieldCheck, Trash2, Users } from "lucide-react"

import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach the Tirbeo team, leave the mailing list, or report a problem.",
}

/* ═══════════════════════════════════════════════════════════════════
   Contact — an inset grouped list, iOS Settings style.
   There is no message backend on this site, so every row is a real
   destination (mailto) rather than a form that goes nowhere.
   ═══════════════════════════════════════════════════════════════════ */

const ROWS = [
  {
    icon: Mail,
    title: "General questions",
    value: "hello@tirbeo.com",
    href: "mailto:hello@tirbeo.com",
    note: "Anything at all. A person reads these.",
  },
  {
    icon: Trash2,
    title: "Leave the mailing list",
    value: "Waitlist removal",
    href: "mailto:hello@tirbeo.com?subject=Waitlist%20removal",
    note: "One line is enough. No reason needed, no follow-up questions.",
  },
  {
    icon: ShieldCheck,
    title: "Report a security issue",
    value: "security@tirbeo.com",
    href: "mailto:security@tirbeo.com",
    note: "Please tell us privately so we can fix it before it is public.",
  },
  {
    icon: Users,
    title: "Teams and partnerships",
    value: "Meet the team",
    href: "/teams",
    note: "Who we are, and how to reach us directly.",
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1 px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            We&apos;re a small team and we answer our own email. Pick the row that fits —
            each one opens your mail app with the right address already filled in.
          </p>

          <ul className="mt-9 overflow-hidden rounded-xl border border-border bg-card">
            {ROWS.map((row, i) => {
              const Icon = row.icon
              const internal = row.href.startsWith("/")
              return (
                <li key={row.title} className={i > 0 ? "border-t border-divider" : undefined}>
                  <a
                    href={row.href}
                    target={internal ? undefined : "_blank"}
                    rel={internal ? undefined : "noreferrer"}
                    className="group flex min-h-[64px] items-center gap-4 px-4 py-4 transition-colors hover:bg-fill sm:px-5"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-fill text-accent-text">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-foreground">
                        {row.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                        {row.note}
                      </span>
                    </span>

                    <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                      {row.value}
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-placeholder transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Prefer somewhere noisier? We post progress on{" "}
            <a
              href="https://x.com/tirbeo"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent-text"
            >
              X
            </a>
            , and the privacy answers are in the{" "}
            <Link
              href="/privacy"
              className="text-foreground underline underline-offset-4 transition-colors hover:text-accent-text"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
