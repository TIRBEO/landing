import Link from "next/link"

/**
 * The one footer for every page on this site.
 *
 * Each page used to carry its own short link list, which is how the legal
 * pages ended up omitting Terms and Contact while the accounts app already
 * linked to them. One list, one place to change.
 */
const LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Tirbeo</p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="-my-1 inline-flex min-h-6 items-center px-1 py-1 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
