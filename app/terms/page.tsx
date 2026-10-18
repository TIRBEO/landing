import type { Metadata } from "next"

import { DocumentPage, Section } from "@/components/document-page"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules for using Tirbeo and its mailing list.",
}

export default function TermsPage() {
  return (
    <DocumentPage title="Terms of Service" updated="19 Oct 2026">
      <p>
        These terms cover the two things Tirbeo offers today: this website and the mailing
        list you can join from it. When the app itself launches, the same agreement keeps
        running and this page gets updated.
      </p>

      <Section title="Using the site">
        <p>
          You may read the site, and subscribe with an email address that is yours. Please
          don&apos;t try to break the signup form, submit other people&apos;s addresses, or
          use the site to send spam.
        </p>
      </Section>

      <Section title="The mailing list">
        <p>
          Subscribing means you agree to receive exactly one thing we have promised so far:
          an email when Tirbeo launches. You can leave the list at any time — see{" "}
          <a
            href="/contact"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-accent-text"
          >
            Contact
          </a>
          .
        </p>
      </Section>

      <Section title="Accounts and sign-in">
        <p>
          Sign-in is handled by our accounts service. You are responsible for keeping your
          password and your device secure, and for anything done from your account. Tell us
          promptly if you think someone else has access.
        </p>
      </Section>

      <Section title="Content and your things">
        <p>
          Anything you post stays yours. By using the app you give us permission to store,
          transmit, and display it where you have chosen to show it — and to make copies for
          backups and for the service to work. We do not take ownership of your content and
          we do not sell it.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          Tirbeo is provided as it is. It&apos;s a small team building in public, so the
          service may change, pause, or have rough edges. We aim not to lose your data, but
          we can&apos;t promise uninterrupted service.
        </p>
      </Section>

      <Section title="Liability">
        <p>
          Where the law allows it, our responsibility for any loss caused by using Tirbeo is
          limited to what we could reasonably have foreseen. Nothing here limits rights that
          cannot be limited by contract.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We&apos;ll update these terms as the product changes, and the “last updated” date
          above will move. Continuing to use Tirbeo after an update means you accept it. If
          a change is something you can&apos;t live with, the remedy is simple: stop using
          it and ask us to delete your data.
        </p>
      </Section>

      <Section title="Getting in touch">
        <p>
          Questions about these terms, or anything else:{" "}
          <a
            href="mailto:hello@tirbeo.com"
            className="text-foreground underline underline-offset-4 transition-colors hover:text-accent-text"
          >
            hello@tirbeo.com
          </a>
          .
        </p>
      </Section>
    </DocumentPage>
  )
}
