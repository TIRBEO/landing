import { Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function Thanks() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-2xl border-2 border-foreground bg-card p-8 text-center shadow-brutal-lg sm:p-14"
        >
          <div className="mx-auto flex size-20 items-center justify-center border-2 border-foreground bg-nb-green shadow-brutal">
            <Check className="size-9" />
          </div>

          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            Message received
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.82] tracking-tight sm:text-7xl">
            Thanks for
            <br />
            reaching out.
          </h1>

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            Your message has been received. Tirbeo is still taking shape, and
            we're glad you're here early.
          </p>

          <a
            href="/"
            className="group mx-auto mt-9 flex w-fit items-center gap-3 border-2 border-foreground bg-foreground px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-background shadow-brutal-sm transition-all hover:-translate-y-1 hover:shadow-brutal"
          >
            Back to Tirbeo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}