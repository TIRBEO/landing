"use client"

import { Mail } from "lucide-react"

import { Header } from "@/components/header"

const members = [
  {
    name: "Bishnu Neupane",
    role: "Founder & CEO",
    email: "bishnuneupane@tirbeo.com",
    image: "/images/team/bishnu.jpg",
  },
  {
    name: "Nirajan Aryal",
    role: "Co-founder",
    email: "nirajanaryal@tirbeo.com",
    image: "/images/team/nirajan.jpg",
  },
  {
    name: "Prabin Pandey",
    role: "Advisor & Manager",
    email: "prabinpandey@tirbeo.com",
    image: "/images/team/prabin.jpg",
  },
] as const

export function TeamList() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1 px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">The team</h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            The people building Tirbeo.
          </p>

          <ul className="mt-10 flex flex-col gap-3">
            {members.map((member) => (
              <li key={member.name}>
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{member.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {member.role}
                    </span>
                  </span>
                  <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-border pt-6">
            <a
              href="mailto:hello@tirbeo.com?subject=Contact"
              className="inline-flex min-h-6 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              hello@tirbeo.com
            </a>
            <p className="mt-1 text-sm text-muted-foreground">Kathmandu, Nepal</p>
          </div>
        </div>
      </main>
    </div>
  )
}
