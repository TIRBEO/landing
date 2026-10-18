import type { Metadata, Viewport } from "next"
import { PageTransition } from "@/components/page-transition"
import { THEME_BOOT } from "@/lib/theme"
import "./globals.css"

const siteUrl = "https://tirbeo.com"
const title = "Tirbeo — Coming soon"
const description =
  "Tirbeo is a new kind of social app, built in public from Kathmandu. Not ready yet."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Tirbeo",
  },
  description,
  applicationName: "Tirbeo",
  keywords: ["Tirbeo", "social app", "Kathmandu", "coming soon"],
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1e" },
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets data-theme + color-scheme before first paint — no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
