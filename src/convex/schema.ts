import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

export const TICKET_STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  WAITING_ON_CUSTOMER: "waiting_on_customer",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export const ticketStatusValidator = v.union(
  v.literal(TICKET_STATUSES.OPEN),
  v.literal(TICKET_STATUSES.IN_PROGRESS),
  v.literal(TICKET_STATUSES.WAITING_ON_CUSTOMER),
  v.literal(TICKET_STATUSES.RESOLVED),
  v.literal(TICKET_STATUSES.CLOSED),
);
export type TicketStatus = Infer<typeof ticketStatusValidator>;

export const TICKET_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const ticketPriorityValidator = v.union(
  v.literal(TICKET_PRIORITIES.LOW),
  v.literal(TICKET_PRIORITIES.MEDIUM),
  v.literal(TICKET_PRIORITIES.HIGH),
  v.literal(TICKET_PRIORITIES.URGENT),
);
export type TicketPriority = Infer<typeof ticketPriorityValidator>;

export const TICKET_CATEGORIES = {
  BILLING: "billing",
  TECHNICAL: "technical",
  ACCOUNT: "account",
  FEATURE: "feature",
  OTHER: "other",
} as const;

export const ticketCategoryValidator = v.union(
  v.literal(TICKET_CATEGORIES.BILLING),
  v.literal(TICKET_CATEGORIES.TECHNICAL),
  v.literal(TICKET_CATEGORIES.ACCOUNT),
  v.literal(TICKET_CATEGORIES.FEATURE),
  v.literal(TICKET_CATEGORIES.OTHER),
);
export type TicketCategory = Infer<typeof ticketCategoryValidator>;

export const messageSenderValidator = v.union(
  v.literal("customer"),
  v.literal("agent"),
  v.literal("system"),
);
export type MessageSender = Infer<typeof messageSenderValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // ---- Support ticket system ----

    // Tickets submitted by customers, triaged by agents.
    tickets: defineTable({
      userId: v.id("users"), // the customer who owns the ticket
      number: v.number(), // human friendly number (TKT-1001)
      subject: v.string(),
      description: v.string(),
      category: ticketCategoryValidator,
      priority: ticketPriorityValidator,
      status: ticketStatusValidator,
      assigneeId: v.optional(v.id("users")), // agent currently working the ticket
      tags: v.array(v.string()),
      satisfaction: v.optional(v.number()), // 1-5 customer rating
      createdAt: v.number(),
      updatedAt: v.number(),
      firstResponseAt: v.optional(v.number()), // when an agent first replied
      resolvedAt: v.optional(v.number()),
      closedAt: v.optional(v.number()),
    })
      .index("by_user", ["userId", "updatedAt"])
      .index("by_status", ["status", "updatedAt"])
      .index("by_assignee", ["assigneeId", "updatedAt"])
      .index("by_number", ["number"])
      .index("by_updated", ["updatedAt"]),

    // The conversation thread of a ticket.
    ticketMessages: defineTable({
      ticketId: v.id("tickets"),
      senderId: v.id("users"),
      senderRole: messageSenderValidator,
      body: v.string(),
      isInternal: v.boolean(), // internal notes are only visible to agents
      createdAt: v.number(),
    }).index("by_ticket", ["ticketId", "createdAt"]),

    // Audit trail of every change made to a ticket.
    ticketActivity: defineTable({
      ticketId: v.id("tickets"),
      actorId: v.id("users"),
      action: v.string(), // created | status_changed | assigned | priority_changed | category_changed | tags_changed | note_added | rated | reopened
      detail: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_ticket", ["ticketId", "createdAt"]),

    // ---- Landing page ----

    // Newsletter / early-access signups from the public landing page.
    waitlist: defineTable({
      email: v.string(),
      note: v.optional(v.string()), // optional "early believer" note shown on the landing page
      createdAt: v.number(),
    })
      .index("by_email", ["email"])
      .index("by_created", ["createdAt"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
