import Link from "next/link"
import type { ReactNode } from "react"

import { Header } from "@/components/header"

/**
 * Shared layout for the flat document pages (privacy, accessibility).
 *
 * A single readable column (65ch) with normal heading sizes — long-form
 * copy, not a landing page.
 */
export function DocumentPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1 px-5 py-14 sm:px-6 sm:py-16">
        <article className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>

          <div className="mt-9 flex flex-col gap-8 text-[15px] leading-[1.75] text-muted-foreground sm:text-base">
            {children}
          </div>
        </article>
      </main>

      <footer className="border-t border-border px-5 py-6">
        <nav className="mx-auto flex max-w-2xl items-center justify-between gap-4 text-sm">
          <Link
            href="/privacy"
            className="-my-1 inline-flex min-h-6 items-center px-1 py-1 text-muted-foreground transition-colors hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="/accessibility"
            className="-my-1 inline-flex min-h-6 items-center px-1 py-1 text-muted-foreground transition-colors hover:text-white"
          >
            Accessibility Statement
          </Link>
        </nav>
      </footer>
    </div>
  )
}

/** A titled section inside a DocumentPage. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 flex flex-col gap-4">{children}</div>
    </section>
  )
}
