import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <div className="veil grain relative isolate flex min-h-dvh flex-col">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" aria-hidden />

      <Header />

      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[100rem] flex-1 flex-col px-5 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32"
      >
        <div className="max-w-2xl">
          <div className="rule-b flex items-center justify-between pb-4">
            <span className="eyebrow text-white/55">Error 404</span>
            <span className="eyebrow text-white/55">Nothing here</span>
          </div>

          {/* Colossal code, same type language as the rest of the site */}
          <p
            aria-hidden="true"
            className="mt-8 text-[clamp(4.5rem,22vw,14rem)] leading-[0.8] font-black tracking-[-0.06em] text-white/35 select-none sm:mt-12"
          >
            404
          </p>

          <h1 className="mt-2 -mt-[0.18em] text-[clamp(1.5rem,4vw,2.25rem)] leading-tight font-bold tracking-[-0.03em] text-white sm:mt-0">
            This page doesn&apos;t exist
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75 sm:text-base">
            The address may be mistyped, or the page may have moved. The two pages below are
            the whole site right now.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/"
              className="-my-1.5 inline-flex h-12 items-center gap-2 border border-white bg-white px-6 text-[14px] font-bold tracking-[0.14em] whitespace-nowrap text-black uppercase transition-colors duration-200 hover:bg-transparent hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Return home
            </Link>
            <Link
              href="/teams"
              className="-my-1.5 inline-flex h-12 items-center border border-white/25 px-6 text-[14px] font-bold tracking-[0.14em] whitespace-nowrap text-white/80 uppercase transition-colors duration-200 hover:border-white hover:bg-white hover:text-black"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}