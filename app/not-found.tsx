import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <>
      <Header />

      <main id="main-content" className="flex min-h-dvh items-center justify-center bg-background px-6 py-20 text-center text-foreground">
        <div className="w-full max-w-md">
          <p className="font-mono text-sm text-muted-foreground mb-4">Error 404</p>
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 mb-8 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Return home
          </Link>
        </div>
      </main>
    </>
  )
}
