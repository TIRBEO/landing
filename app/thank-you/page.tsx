import type { Metadata } from "next"
import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"

import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "You're on the list",
  description: "Thanks for joining the Tirbeo mailing list.",
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  {
    title: "Watch for the launch email",
    note: "It comes from hello@tirbeo.com, once, when the site goes live.",
  },
  {
    title: "Add us to your contacts",
    note: "Launch mail lands in the inbox only if the spam filter knows us.",
  },
  {
    title: "Change your mind any time",
    note: "Every email carries an unsubscribe link, or just ask us.",
  },
]

export default function ThankYouPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-lg text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
            <Check className="size-7" aria-hidden="true" />
          </span>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            You&apos;re on the list
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Thanks for signing up. We&apos;ll email you the moment Tirbeo is live — nothing
            before that.
          </p>

          <ul className="mt-9 overflow-hidden rounded-xl border border-border bg-card text-left">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className={i > 0 ? "border-t border-divider" : undefined}>
                <div className="flex min-h-[56px] items-center gap-4 px-4 py-4 sm:px-5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-foreground">
                      {step.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
                      {step.note}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              Back to the site
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-1 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:border-border-strong hover:bg-fill"
            >
              Get in touch
              <ChevronRight className="size-4 text-placeholder" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
