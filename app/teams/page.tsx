import type { Metadata } from "next"

import { TeamList } from "@/components/team-list"

export const metadata: Metadata = {
  title: "The Team",
  description: "The people behind Tirbeo — building a new kind of social app.",
}

export default function TeamsPage() {
  return <TeamList />
}
