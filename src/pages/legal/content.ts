/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — legal documents content
   ══════════════════════════════════════════════════════════════════════════ */

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: string;
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  contact: string;
};

/* ── Privacy Policy ──────────────────────────────────────────────────────── */
export const privacyDoc: LegalDoc = {
  slug: "privacy",
  eyebrow: "Privacy Policy",
  title: "Your privacy, respected.",
  updated: "Last updated: August 8, 2026",
  intro:
    "Tirbeo is an independent technology company exploring better ways for people to connect, create, and collaborate. This Privacy Policy explains what information we collect when you visit our website, sign up for updates, or use our products and services — and how we use, protect, and share it. We keep our practices private-first: we collect the minimum we need, and we never sell your personal information.",
  sections: [
    {
      heading: "Information we collect",
      paragraphs: [
        "We collect information you give us directly. When you join the waitlist, we ask for your name and email address, and optionally a message. If you create an account with a Tirbeo product, we collect the details needed to set it up — such as your name, email, and password (stored securely, never in plain text).",
        "We also collect limited technical information automatically, such as your browser type, device type, approximate region, and which pages you visit. This helps us understand how the site is used and keep it fast and reliable.",
      ],
      bullets: [
        "Contact details — name, email address, and any message you choose to share.",
        "Account data — credentials and profile information for Tirbeo products.",
        "Usage data — pages visited, referrer, and basic analytics events.",
      ],
    },
    {
      heading: "How we use your information",
      paragraphs: [
        "We use the information we collect to operate and improve Tirbeo: to send you the updates you asked for, to keep the site and services secure, to respond to questions, and to make products better over time.",
        "If you join the waitlist, we will contact you with news about Tirbeo, new projects, and important announcements. You can unsubscribe at any time with a single click, and we will stop sending you those updates.",
      ],
    },
    {
      heading: "Our legal bases",
      paragraphs: [
        "Where data-protection law requires a legal basis for processing, we rely on your consent (for example, when you subscribe to updates), on the performance of a contract (when you use our services), and on our legitimate interests in operating and improving Tirbeo — balanced against your rights and expectations.",
      ],
    },
    {
      heading: "How we share information",
      paragraphs: [
        "We do not sell your personal information. We share it only in limited, necessary cases:",
      ],
      bullets: [
        "Service providers — trusted partners who help us run the site (hosting, email delivery, analytics) under strict confidentiality.",
        "Legal obligations — if required by law, regulation, or a valid legal request.",
        "Business changes — in connection with a merger, acquisition, or restructuring.",
      ],
    },
    {
      heading: "Data retention",
      paragraphs: [
        "We keep your information only as long as needed for the purposes described in this policy. Waitlist entries are retained while the waitlist is active. When you ask us to delete your information, or when it is no longer needed, we remove it or anonymize it.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Depending on where you live, you may have the right to access, correct, or delete your personal information, to object to or restrict processing, to receive a copy of your data, and to withdraw consent at any time.",
        "To exercise any of these rights, email us at privacy@tirbeo.app. We will respond within the timeframes required by law. You may also have the right to complain to your local data-protection authority.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "We take reasonable technical and organizational measures to protect your information against loss, misuse, and unauthorized access — including encryption in transit, access controls, and regular review of our practices.",
        "No method of transmission over the internet is completely secure, so while we work hard to protect your data, we cannot guarantee absolute security.",
      ],
    },
    {
      heading: "Children's privacy",
      paragraphs: [
        "Tirbeo's products and website are not directed to children under 16, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.",
      ],
    },
    {
      heading: "International transfers",
      paragraphs: [
        "If you are located outside the country where our services are hosted, your information may be transferred to and processed in another country. We apply appropriate safeguards so that your information remains protected wherever it is processed.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy as Tirbeo evolves. When we make material changes, we will update the date at the top of this page and, where appropriate, notify you. Your continued use of the site after changes take effect means you accept the updated policy.",
      ],
    },
  ],
  contact: "privacy@tirbeo.app",
};

/* ── Terms of Service ────────────────────────────────────────────────────── */
export const termsDoc: LegalDoc = {
  slug: "terms",
  eyebrow: "Terms of Service",
  title: "Clear terms for real use.",
  updated: "Last updated: August 8, 2026",
  intro:
    "These Terms of Service ('Terms') govern your access to and use of the Tirbeo website, waitlist, and any Tirbeo products or services made available to you. By accessing or using anything we make available, you agree to these Terms. Please read them carefully.",
  sections: [
    {
      heading: "Acceptance of these terms",
      paragraphs: [
        "By visiting the Tirbeo website, joining the waitlist, or using a Tirbeo product, you agree to be bound by these Terms. If you do not agree, please do not use our services.",
      ],
    },
    {
      heading: "Using Tirbeo",
      paragraphs: [
        "You may use our website and services for lawful purposes only. You agree not to misuse the services, attempt to gain unauthorized access, interfere with their operation, or use them in any way that could harm Tirbeo or other users.",
      ],
      bullets: [
        "Do not attempt to disrupt, overload, or damage our systems.",
        "Do not use the services to transmit unlawful, harmful, or malicious content.",
        "Do not scrape or harvest data from the site at scale.",
      ],
    },
    {
      heading: "Accounts and credentials",
      paragraphs: [
        "Where Tirbeo products require an account, you are responsible for keeping your credentials confidential and for all activity under your account. You agree to notify us promptly of any unauthorized use.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The Tirbeo name, logo, and all content on the website — including text, graphics, and design — are owned by Tirbeo or its licensors and are protected by intellectual-property laws. You may not copy, modify, distribute, or use them commercially without our permission.",
      ],
    },
    {
      heading: "Our services as they evolve",
      paragraphs: [
        "Tirbeo is a company in the making. Products, features, and availability may change, be delayed, or be discontinued at any time. We are transparent about this: we build publicly and adjust as we learn.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        "The website and services are provided 'as is' and 'as available', without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the services will be uninterrupted, error-free, or completely secure.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Tirbeo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising out of or relating to your use of the services. Our total liability for any claim shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.",
      ],
    },
    {
      heading: "Termination",
      paragraphs: [
        "We may suspend or terminate your access to the services at any time, with or without notice, for conduct that we reasonably believe violates these Terms or harms other users. You may stop using the services at any time.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These Terms are governed by the laws applicable where Tirbeo is established, without regard to conflict-of-law principles. You agree to the exclusive jurisdiction of the courts in that location for any disputes arising from these Terms.",
      ],
    },
    {
      heading: "Changes to these terms",
      paragraphs: [
        "We may update these Terms from time to time. The latest version will always be posted on this page, with the date updated. If we make material changes, we will take reasonable steps to notify you. Continued use after changes means you accept the updated Terms.",
      ],
    },
  ],
  contact: "legal@tirbeo.app",
};

/* ── Cookie Policy ───────────────────────────────────────────────────────── */
export const cookiesDoc: LegalDoc = {
  slug: "cookies",
  eyebrow: "Cookie Policy",
  title: "Cookies, explained simply.",
  updated: "Last updated: August 8, 2026",
  intro:
    "This Cookie Policy explains what cookies are, how Tirbeo uses them on its website, and how you can control them. It is part of our Privacy Policy. By continuing to browse the site, you agree to our use of cookies as described here.",
  sections: [
    {
      heading: "What are cookies?",
      paragraphs: [
        "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, understand how it is used, and work reliably.",
      ],
    },
    {
      heading: "How we use cookies",
      paragraphs: [
        "We use cookies to keep the site functioning, to measure how it is used so we can improve it, and to remember choices you make (such as language or region). We do not use cookies to build advertising profiles or to track you across unrelated websites.",
      ],
      bullets: [
        "Essential cookies — required for the site to work (for example, session handling and security).",
        "Analytics cookies — help us understand aggregate usage, such as page views and popular pages.",
        "Preference cookies — remember your choices and settings between visits.",
      ],
    },
    {
      heading: "Third-party cookies",
      paragraphs: [
        "Some cookies are set by services we use to operate the site, such as analytics providers. These third parties may process usage data on our behalf under their own privacy policies. Where possible, we configure these services to minimize data collection.",
      ],
    },
    {
      heading: "Managing and deleting cookies",
      paragraphs: [
        "You can control cookies through your browser settings — most browsers let you block or delete cookies, and some let you block third-party cookies specifically. You can also use private or incognito browsing to limit what is stored.",
        "If you disable essential cookies, parts of the site may not work as intended. Disabling analytics or preference cookies does not affect core functionality.",
      ],
    },
    {
      heading: "Do Not Track",
      paragraphs: [
        "Some browsers offer a 'Do Not Track' (DNT) setting. We aim to respect DNT signals where we can, and we do not engage in cross-site tracking of our visitors regardless of these settings.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this Cookie Policy as our practices evolve. The latest version will always be available on this page, with the date updated. Material changes will be highlighted where practical.",
      ],
    },
  ],
  contact: "privacy@tirbeo.app",
};

export const legalDocs: Record<string, LegalDoc> = {
  privacy: privacyDoc,
  terms: termsDoc,
  cookies: cookiesDoc,
};
