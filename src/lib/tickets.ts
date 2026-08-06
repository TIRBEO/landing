import { format, formatDistanceToNowStrict } from "date-fns";
import type { Doc } from "@/convex/_generated/dataModel";

export const AGENT_ROLE = "admin" as const;

export const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_on_customer: "Waiting on Customer",
  resolved: "Resolved",
  closed: "Closed",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const CATEGORY_LABELS: Record<string, string> = {
  billing: "Billing",
  technical: "Technical",
  account: "Account",
  feature: "Feature Request",
  other: "Other",
};

export const STATUS_ORDER = [
  "open",
  "in_progress",
  "waiting_on_customer",
  "resolved",
  "closed",
] as const;

export const PRIORITY_ORDER = ["low", "medium", "high", "urgent"] as const;

export const CATEGORY_ORDER = [
  "billing",
  "technical",
  "account",
  "feature",
  "other",
] as const;

export type Status = (typeof STATUS_ORDER)[number];
export type Priority = (typeof PRIORITY_ORDER)[number];
export type Category = (typeof CATEGORY_ORDER)[number];

/** Flat neobrutalism color blocks for status badges. */
export const STATUS_BADGE_CLASS: Record<string, string> = {
  open: "bg-nb-blue text-foreground",
  in_progress: "bg-nb-yellow text-foreground",
  waiting_on_customer: "bg-nb-orange text-foreground",
  resolved: "bg-nb-green text-foreground",
  closed: "bg-muted text-muted-foreground",
};

export const PRIORITY_BADGE_CLASS: Record<string, string> = {
  low: "bg-secondary text-foreground",
  medium: "bg-nb-yellow text-foreground",
  high: "bg-nb-orange text-foreground",
  urgent: "bg-destructive text-white",
};

export const CATEGORY_BADGE_CLASS: Record<string, string> = {
  billing: "bg-nb-green text-foreground",
  technical: "bg-nb-blue text-foreground",
  account: "bg-nb-pink text-foreground",
  feature: "bg-nb-purple text-foreground",
  other: "bg-secondary text-foreground",
};

export function ticketNumber(n: number) {
  return `TKT-${n}`;
}

export function formatRelative(ts: number) {
  return formatDistanceToNowStrict(ts, { addSuffix: true });
}

export function formatDate(ts: number) {
  return format(ts, "MMM d, yyyy 'at' h:mm a");
}

export function displayName(user?: Pick<Doc<"users">, "name" | "email"> | null) {
  if (user?.name) return user.name;
  if (user?.email) return user.email.split("@")[0];
  return "Guest";
}

export function initials(user?: Pick<Doc<"users">, "name" | "email"> | null) {
  if (user?.name) {
    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join("");
  }
  if (user?.email) return user.email[0]!.toUpperCase();
  return "?";
}

/** Human-readable rendering of a ticketActivity action. */
export function activityLabel(
  action: string,
  detail?: string,
  actorName?: string,
) {
  const who = actorName ? ` — ${actorName}` : "";
  switch (action) {
    case "created":
      return `Ticket created${who}`;
    case "status_changed":
      return `Status changed: ${detail ?? "updated"}${who}`;
    case "closed":
      return `Ticket closed${who}`;
    case "assigned":
      return detail === "unassigned"
        ? `Unassigned ticket${who}`
        : `Assigned to ${detail ?? "an agent"}${who}`;
    case "priority_changed":
      return `Priority changed: ${detail ?? "updated"}${who}`;
    case "category_changed":
      return `Category changed: ${detail ?? "updated"}${who}`;
    case "tags_changed":
      return `Tags updated${who}`;
    case "note_added":
      return `Internal note added${who}`;
    case "rated":
      return `Customer rated the resolution ${detail ?? ""}${who}`;
    case "reopened":
      return `Ticket reopened${who}`;
    default:
      return `${action.replace(/_/g, " ")}${who}`;
  }
}
