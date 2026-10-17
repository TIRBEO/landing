import Link from "next/link"

import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-white/90"
            >
              Return home
            </Link>
            <Link
              href="/teams"
              className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}