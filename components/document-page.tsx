import Link from "next/link"
import type { ReactNode } from "react"

import { Header } from "@/components/header"

/**
 * Shared layout for the flat document pages (privacy, accessibility).
 *
 * Same monochrome system as the rest of the site: a single measure of text
 * (65ch) so long-form copy stays readable, hairline rules between sections,
 * and the same footer links every page carries.
 */
export function DocumentPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <div className="veil grain relative isolate flex min-h-dvh flex-col">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <Header />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[100rem] flex-1 px-5 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32"
      >
        <article className="max-w-[65ch] pb-4">
          <div className="rule-b flex items-center justify-between pb-4">
            <span className="eyebrow text-white/55">{eyebrow}</span>
            <span className="eyebrow text-white/55">Updated {updated}</span>
          </div>

          <h1 className="mt-8 text-[clamp(2.25rem,7vw,3.75rem)] leading-[0.95] font-black tracking-[-0.04em] text-white uppercase sm:mt-12">
            {title}
          </h1>

          <div className="mt-10 flex flex-col gap-9 text-[15px] leading-[1.75] text-white/75 sm:text-base">
            {children}
          </div>
        </article>

        <footer className="rule-t mt-16 flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/50">
            <Link
              href="/privacy"
              className="-my-1.5 inline-flex items-center py-2 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/accessibility"
              className="-my-1.5 inline-flex items-center py-2 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              Accessibility Statement
            </Link>
          </div>
          <Link
            href="/"
            className="-my-2 inline-flex min-h-6 items-center py-2 eyebrow text-white/55 transition-colors hover:text-white"
          >
            Tirbeo — Back home
          </Link>
        </footer>
      </main>
    </div>
  )
}

/** A titled section inside a DocumentPage. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="eyebrow rule-t pt-5 text-white/55">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  )
}