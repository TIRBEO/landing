import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  ROLES,
  TICKET_STATUSES,
  ticketCategoryValidator,
  ticketPriorityValidator,
  ticketStatusValidator,
} from "./schema";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

/** Resolve the signed-in user id or throw. */
async function requireUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  return userId;
}

async function logActivity(
  ctx: MutationCtx,
  ticketId: Id<"tickets">,
  actorId: Id<"users">,
  action: string,
  detail?: string,
) {
  await ctx.db.insert("ticketActivity", {
    ticketId,
    actorId,
    action,
    detail,
    createdAt: Date.now(),
  });
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Tickets owned by the current customer (or submitted by an agent). */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("tickets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/** The agent queue — all tickets with optional filters. Agent only. */
export const listAll = query({
  args: {
    status: v.optional(ticketStatusValidator),
    priority: v.optional(ticketPriorityValidator),
    category: v.optional(ticketCategoryValidator),
    assignee: v.optional(v.string()), // "me" | "unassigned" | user id
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    if (me?.role !== ROLES.ADMIN) throw new Error("Agents only");

    let tickets = await ctx.db.query("tickets").collect();

    if (args.status) tickets = tickets.filter((t) => t.status === args.status);
    if (args.priority) tickets = tickets.filter((t) => t.priority === args.priority);
    if (args.category) tickets = tickets.filter((t) => t.category === args.category);
    if (args.assignee === "me") tickets = tickets.filter((t) => t.assigneeId === userId);
    else if (args.assignee === "unassigned") tickets = tickets.filter((t) => !t.assigneeId);
    else if (args.assignee) tickets = tickets.filter((t) => t.assigneeId === (args.assignee as Id<"users">));

    if (args.search) {
      const q = args.search.trim().toLowerCase();
      if (q) {
        tickets = tickets.filter((t) => {
          const number = `tkt-${t.number}`;
          return (
            t.subject.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            number.includes(q)
          );
        });
      }
    }

    return tickets.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

/** Full detail of one ticket: thread + activity + related people. */
export const get = query({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    const agent = me?.role === ROLES.ADMIN;

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.userId !== userId && !agent) throw new Error("Not authorized");

    const [messages, activity] = await Promise.all([
      ctx.db
        .query("ticketMessages")
        .withIndex("by_ticket", (q) => q.eq("ticketId", args.ticketId))
        .order("asc")
        .collect(),
      ctx.db
        .query("ticketActivity")
        .withIndex("by_ticket", (q) => q.eq("ticketId", args.ticketId))
        .order("asc")
        .collect(),
    ]);

    // resolve sender identities
    const senderIds = new Set<string>([
      ticket.userId,
      ...(ticket.assigneeId ? [ticket.assigneeId] : []),
    ]);
    messages.forEach((m) => senderIds.add(m.senderId));
    activity.forEach((a) => senderIds.add(a.actorId));
    const people: Record<string, Doc<"users"> | null> = {};
    await Promise.all(
      [...senderIds].map(async (id) => {
        people[id] = (await ctx.db.get(id as Id<"users">)) ?? null;
      }),
    );

    return {
      ticket,
      messages,
      activity,
      customer: people[ticket.userId] ?? null,
      assignee: ticket.assigneeId ? people[ticket.assigneeId] ?? null : null,
      people,
    };
  },
});

/** Agent dashboard stats. */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    if (me?.role !== ROLES.ADMIN) throw new Error("Agents only");

    const tickets = await ctx.db.query("tickets").collect();

    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let unassigned = 0;
    let firstResponseTotalMs = 0;
    let firstResponseCount = 0;
    let satisfactionTotal = 0;
    let satisfactionCount = 0;

    tickets.forEach((t) => {
      byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
      byPriority[t.priority] = (byPriority[t.priority] ?? 0) + 1;
      byCategory[t.category] = (byCategory[t.category] ?? 0) + 1;
      if (!t.assigneeId) unassigned += 1;
      if (t.firstResponseAt) {
        firstResponseTotalMs += t.firstResponseAt - t.createdAt;
        firstResponseCount += 1;
      }
      if (t.satisfaction !== undefined) {
        satisfactionTotal += t.satisfaction;
        satisfactionCount += 1;
      }
    });

    // tickets created per day for the last 14 days
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    for (let i = 13; i >= 0; i--) {
      const start = todayStart - i * 86400000;
      const end = start + 86400000;
      const label = new Date(start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      days.push({
        date: label,
        count: tickets.filter((t) => t.createdAt >= start && t.createdAt < end).length,
      });
    }

    return {
      total: tickets.length,
      open: byStatus[TICKET_STATUSES.OPEN] ?? 0,
      inProgress: byStatus[TICKET_STATUSES.IN_PROGRESS] ?? 0,
      waitingOnCustomer: byStatus[TICKET_STATUSES.WAITING_ON_CUSTOMER] ?? 0,
      resolved: byStatus[TICKET_STATUSES.RESOLVED] ?? 0,
      closed: byStatus[TICKET_STATUSES.CLOSED] ?? 0,
      unassigned,
      byPriority,
      byCategory,
      byStatus,
      days,
      avgFirstResponseHours:
        firstResponseCount > 0
          ? Math.round((firstResponseTotalMs / firstResponseCount / 3600000) * 10) / 10
          : null,
      avgSatisfaction:
        satisfactionCount > 0
          ? Math.round((satisfactionTotal / satisfactionCount) * 10) / 10
          : null,
      satisfactionCount,
      resolutionRate:
        tickets.length > 0
          ? Math.round(
              (((byStatus[TICKET_STATUSES.RESOLVED] ?? 0) +
                (byStatus[TICKET_STATUSES.CLOSED] ?? 0)) /
                tickets.length) *
                100,
            )
          : 0,
    };
  },
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Customer submits a new ticket. */
export const create = mutation({
  args: {
    subject: v.string(),
    description: v.string(),
    category: ticketCategoryValidator,
    priority: ticketPriorityValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const me = await ctx.db.get(userId);

    const subject = args.subject.trim();
    const description = args.description.trim();
    if (!subject || !description) throw new Error("Subject and description are required");
    if (subject.length > 200) throw new Error("Subject is too long");

    // first-time users become regular customers
    if (me && !me.role) await ctx.db.patch(userId, { role: ROLES.USER });

    const now = Date.now();
    const allTickets = await ctx.db.query("tickets").collect();
    const number = 1000 + allTickets.length + 1;

    const ticketId = await ctx.db.insert("tickets", {
      userId,
      number,
      subject,
      description,
      category: args.category,
      priority: args.priority,
      status: TICKET_STATUSES.OPEN,
      tags: [],
      createdAt: now,
      updatedAt: now,
    });
    await logActivity(ctx, ticketId, userId, "created");
    return ticketId;
  },
});

/** Customer or agent adds a message to the thread. Agents may add internal notes. */
export const reply = mutation({
  args: {
    ticketId: v.id("tickets"),
    body: v.string(),
    isInternal: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const me = await ctx.db.get(userId);
    const agent = me?.role === ROLES.ADMIN;
    const isInternal = !!args.isInternal;

    if (isInternal && !agent) throw new Error("Internal notes are for agents only");

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.userId !== userId && !agent) throw new Error("Not authorized");
    if (ticket.status === TICKET_STATUSES.CLOSED) throw new Error("This ticket is closed");

    const body = args.body.trim();
    if (!body) throw new Error("Message cannot be empty");

    const now = Date.now();
    await ctx.db.insert("ticketMessages", {
      ticketId: args.ticketId,
      senderId: userId,
      senderRole: agent ? "agent" : "customer",
      body,
      isInternal,
      createdAt: now,
    });

    const patch: Record<string, any> = { updatedAt: now };

    if (agent) {
      if (!ticket.firstResponseAt) patch.firstResponseAt = now;
      if (!isInternal && ticket.status === TICKET_STATUSES.OPEN) {
        patch.status = TICKET_STATUSES.WAITING_ON_CUSTOMER;
        await logActivity(
          ctx,
          args.ticketId,
          userId,
          "status_changed",
          `${ticket.status} → ${TICKET_STATUSES.WAITING_ON_CUSTOMER}`,
        );
      }
      if (isInternal) {
        await logActivity(ctx, args.ticketId, userId, "note_added");
      }
    } else {
      // customer replied — the ball is back on the agent's side
      if (ticket.status === TICKET_STATUSES.WAITING_ON_CUSTOMER) {
        patch.status = TICKET_STATUSES.IN_PROGRESS;
        await logActivity(
          ctx,
          args.ticketId,
          userId,
          "status_changed",
          `${ticket.status} → ${TICKET_STATUSES.IN_PROGRESS}`,
        );
      }
    }

    await ctx.db.patch(args.ticketId, patch);
    return args.ticketId;
  },
});

/** Agent triage: status, priority, category, assignee, tags. */
export const update = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.optional(ticketStatusValidator),
    priority: v.optional(ticketPriorityValidator),
    category: v.optional(ticketCategoryValidator),
    assigneeId: v.optional(v.union(v.id("users"), v.null())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const me = await ctx.db.get(userId);
    if (me?.role !== ROLES.ADMIN) throw new Error("Agents only");

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const now = Date.now();
    const patch: Record<string, any> = { updatedAt: now };

    if (args.status && args.status !== ticket.status) {
      patch.status = args.status;
      patch.resolvedAt =
        args.status === TICKET_STATUSES.RESOLVED ||
        args.status === TICKET_STATUSES.CLOSED
          ? now
          : undefined;
      patch.closedAt = args.status === TICKET_STATUSES.CLOSED ? now : undefined;
      await logActivity(
        ctx,
        args.ticketId,
        userId,
        args.status === TICKET_STATUSES.CLOSED ? "closed" : "status_changed",
        `${ticket.status} → ${args.status}`,
      );
    }

    if (args.priority && args.priority !== ticket.priority) {
      patch.priority = args.priority;
      await logActivity(
        ctx,
        args.ticketId,
        userId,
        "priority_changed",
        `${ticket.priority} → ${args.priority}`,
      );
    }

    if (args.category && args.category !== ticket.category) {
      patch.category = args.category;
      await logActivity(
        ctx,
        args.ticketId,
        userId,
        "category_changed",
        `${ticket.category} → ${args.category}`,
      );
    }

    if (args.assigneeId !== undefined && args.assigneeId !== ticket.assigneeId) {
      patch.assigneeId = args.assigneeId ?? undefined;
      if (args.assigneeId) {
        const assignee = await ctx.db.get(args.assigneeId);
        await logActivity(
          ctx,
          args.ticketId,
          userId,
          "assigned",
          assignee?.name ?? assignee?.email ?? "an agent",
        );
      } else {
        await logActivity(ctx, args.ticketId, userId, "assigned", "unassigned");
      }
    }

    if (args.tags && args.tags.length !== ticket.tags.length) {
      patch.tags = args.tags;
      await logActivity(ctx, args.ticketId, userId, "tags_changed");
    }

    await ctx.db.patch(args.ticketId, patch);
    return args.ticketId;
  },
});

/** Customer rates their resolved ticket 1-5. */
export const setSatisfaction = mutation({
  args: { ticketId: v.id("tickets"), rating: v.number() },
  handler: async (ctx, args) => {
    const userId = await requireUser(ctx);
    const me = await ctx.db.get(userId);
    const agent = me?.role === ROLES.ADMIN;

    if (args.rating < 1 || args.rating > 5) throw new Error("Rating must be 1-5");

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.userId !== userId && !agent) throw new Error("Not authorized");

    await ctx.db.patch(args.ticketId, { satisfaction: args.rating });
    await logActivity(ctx, args.ticketId, userId, "rated", `${args.rating}/5`);
    return args.ticketId;
  },
});
