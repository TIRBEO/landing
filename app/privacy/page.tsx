import type { Metadata } from "next"

import { DocumentPage, Section } from "@/components/document-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Tirbeo collects, why, and how to reach us.",
}

export default function PrivacyPage() {
  return (
    <DocumentPage eyebrow="Legal" title="Privacy Policy" updated="5 Oct 2026">
      <p>
        Tirbeo is not open yet. While we wait, the only thing this site can collect is an
        email address you type into the mailing list yourself. This page explains what
        happens to it.
      </p>

      <Section title="What we collect">
        <p>
          When you subscribe, we store your email address and the date you subscribed. We
          also record the IP address the request came from, purely to spot and throttle
          automated signups.
        </p>
        <p>
          If you use the waitlist admin area, a signed cookie is set so you stay logged
          in. It contains no personal data and is cleared when you log out.
        </p>
      </Section>

      <Section title="Why we collect it">
        <p>
          To email you once, when the site launches. Nothing else. There is no marketing
          list, no advertising, no profiling, and we do not share or sell your address to
          anyone.
        </p>
      </Section>

      <Section title="Who else is involved">
        <p>
          Our host and our spam checker (Cloudflare Turnstile) necessarily see the request
          in order to serve the page and check that a signup came from a person rather
          than a bot. Cloudflare processes that data on our behalf under their own terms.
        </p>
      </Section>

      <Section title="How long we keep it">
        <p>
          Until you launch, and until you ask us to remove you — whichever comes first.
        </p>
      </Section>

      <Section title="Removing yourself">
        <p>
          Email{" "}
          <a
            href="mailto:hello@tirbeo.com?subject=Waitlist%20removal"
            className="-my-2 inline-flex items-center py-2.5 text-white underline underline-offset-4 transition-colors hover:text-white/70"
          >
            hello@tirbeo.com
          </a>{" "}
          with the subject line “Waitlist removal” and we will delete your address. No
          reason needed, and no follow-up questions.
        </p>
      </Section>
    </DocumentPage>
  )
}