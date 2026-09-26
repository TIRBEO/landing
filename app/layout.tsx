import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { PageTransition } from "@/components/page-transition"
import "./globals.css"

const siteUrl = "https://tirbeo.app"
const title = "Tirbeo — Coming soon"
const description =
  "Tirbeo is a new kind of social app, built in public from Kathmandu. Not ready yet."

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

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
  colorScheme: "dark",
  themeColor: "#060403",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* bg paints before CSS arrives, so a hard refresh never flashes white */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.style.background="#060403"`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-dvh bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-accent-foreground`}
      >
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
