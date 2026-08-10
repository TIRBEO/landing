import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { LogoMark, SectionEyebrow } from "../aura/primitives";
import { CookieConsent } from "../aura/CookieConsent";
import { legalDocs } from "./content";
import "../aura.css";

/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — legal pages (Privacy / Terms / Cookies) · dark editorial theme
   ══════════════════════════════════════════════════════════════════════════ */

const LEGAL_NAV = [
  { slug: "privacy", label: "Privacy" },
  { slug: "terms", label: "Terms" },
  { slug: "cookies", label: "Cookies" },
];

export default function Legal({ slug = "privacy" }: { slug?: string }) {
  const doc = legalDocs[slug] ?? legalDocs.privacy;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${doc.title} — Tirbeo`;
  }, [doc]);

  return (
    <div className="aura relative min-h-screen overflow-x-hidden bg-[#0a0a14] text-white">
      {/* Animated colorful aurora background */}
      <div className="aura-aurora" aria-hidden="true" />

      {/* Fixed guide lines */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%_+_36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%_+_36rem)] w-px bg-white/10 z-[5]" />

      <div className="relative z-10">
        {/* Nav */}
        <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" aria-label="Tirbeo home" className="flex shrink-0 items-center gap-2">
            <LogoMark className="w-8 h-8 text-white" />
            <span className="text-lg font-semibold tracking-tight text-white">Tirbeo</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {LEGAL_NAV.map((item) => (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className={`text-sm font-medium transition-colors ${
                  item.slug === doc.slug ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 text-white text-sm font-medium px-5 py-2.5 transition-all hover:bg-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
          <Link
            to="/"
            className="md:hidden inline-flex items-center gap-2 rounded-full border border-white/15 text-white text-sm font-medium px-4 py-2 transition-all hover:bg-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </header>

        {/* Document header */}
        <section className="max-w-4xl mx-auto px-6 pt-14 md:pt-20 pb-6">
          <SectionEyebrow label={doc.eyebrow} />
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0] text-white">
            {doc.title}
          </h1>
          <p className="mt-6 text-xs tracking-[0.18em] text-white/30 uppercase">{doc.updated}</p>
          <p className="mt-8 text-white/60 text-base md:text-lg leading-[1.8] max-w-2xl">
            {doc.intro}
          </p>
        </section>

        {/* Sections */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="border-t border-white/10">
            {doc.sections.map((section, i) => (
              <div key={section.heading} className="border-b border-white/10 py-10 md:py-12 grid md:grid-cols-12 gap-6">
                <div className="md:col-span-3">
                  <span className="ghost-num ghost-num--sm ghost-num--violet" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="md:col-span-9">
                  <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, pi) => (
                    <p key={`${section.heading}-${pi}`} className="mt-4 text-white/55 text-sm md:text-base leading-[1.8]">
                      {p}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-5 space-y-3">
                      {section.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm md:text-base text-white/60 leading-[1.7]">
                          <span className="mt-1 w-4 h-4 shrink-0 rounded-full border border-[#ffffff]/40 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-[#A4F4FD]" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-14 rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-10">
            <h2 className="text-lg font-semibold text-white">Questions about this policy?</h2>
            <p className="mt-3 text-white/55 text-sm leading-[1.7] max-w-lg">
              We're happy to answer any questions about how Tirbeo handles your
              information. Reach out and we'll get back to you.
            </p>
            <a
              href={`mailto:${doc.contact}`}
              className="group mt-6 inline-flex items-center gap-2 rounded-full btn-gradient text-white font-medium text-sm px-6 py-3"
            >
              {doc.contact}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" />
            </a>
          </div>
        </section>

        {/* Footer strip */}
        <footer className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/35">
            <span>© 2026 Tirbeo. All rights reserved.</span>
            <div className="flex items-center gap-6">
              {LEGAL_NAV.map((item) => (
                <Link
                  key={item.slug}
                  to={`/${item.slug}`}
                  className={`transition-colors ${
                    item.slug === doc.slug ? "text-white/70" : "hover:text-white/70"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/" className="hover:text-white/70 transition-colors">
                Home
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("tirbeo:manage-cookies"))}
                className="hover:text-white/70 transition-colors cursor-pointer"
              >
                Manage cookies
              </button>
            </div>
          </div>
        </footer>
      </div>

      <CookieConsent />
    </div>
  );
}
