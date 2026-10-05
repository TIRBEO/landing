import type { Metadata } from "next"

import { DocumentPage, Section } from "@/components/document-page"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "How accessible Tirbeo aims to be, and how to tell us when it isn't.",
}

export default function AccessibilityPage() {
  return (
    <DocumentPage eyebrow="Legal" title="Accessibility" updated="5 Oct 2026">
      <p>
        We want this site to be usable by everyone, including people who browse with a
        keyboard, use a screen reader, or need text scaled up. This page records what we
        have done and where we know we fall short.
      </p>

      <Section title="What we have done">
        <p>
          The site targets WCAG 2.2 level AA. Every interactive control can be reached and
          operated with a keyboard, focus is always visible, and the focus order follows
          the visual order.
        </p>
        <p>
          Text and background contrast meet or exceed AA at every page size. Status
          messages are announced to screen readers, form fields have real labels, and
          decorative graphics are hidden from assistive technology.
        </p>
        <p>
          The layout is fluid rather than fixed, so it reflows down to 320px wide and up to
          large desktop screens without horizontal scrolling or zooming. Text stays
          selectable and stays put when the page is zoomed to 200%.
        </p>
      </Section>

      <Section title="Known limitations">
        <p>
          The signup form is protected by a third-party captcha (Cloudflare Turnstile).
          Captchas are difficult for some assistive technology: the widget may present a
          puzzle that a screen reader user cannot complete.
        </p>
        <p>
          To work around this, if the captcha cannot load at all, the form tells you so
          and still lets you submit. Signups are additionally limited per IP address.
        </p>
      </Section>

      <Section title="Tell us when something is wrong">
        <p>
          If any part of this site gets in your way, email{" "}
          <a
            href="mailto:hello@tirbeo.com?subject=Accessibility"
            className="-my-2 inline-flex items-center py-2.5 text-white underline underline-offset-4 transition-colors hover:text-white/70"
          >
            hello@tirbeo.com
          </a>{" "}
          describing the page and the problem. We read every message and treat access
          problems as bugs, not feature requests.
        </p>
      </Section>
    </DocumentPage>
  )
}