import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { ROLES, roleValidator } from "./schema";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

/** All users with per-user ticket stats. Agents only. */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    if (me?.role !== ROLES.ADMIN) throw new Error("Agents only");

    const users = await ctx.db.query("users").collect();
    const tickets = await ctx.db.query("tickets").collect();

    const byUser = new Map<Id<"users">, { total: number; open: number; resolved: number }>();
    tickets.forEach((t) => {
      const entry = byUser.get(t.userId) ?? { total: 0, open: 0, resolved: 0 };
      entry.total += 1;
      if (t.status === "open" || t.status === "in_progress" || t.status === "waiting_on_customer")
        entry.open += 1;
      if (t.status === "resolved" || t.status === "closed") entry.resolved += 1;
      byUser.set(t.userId, entry);
    });

    return users
      .map((u) => ({
        ...u,
        ticketStats: byUser.get(u._id as Id<"users">) ?? { total: 0, open: 0, resolved: 0 },
      }))
      .sort((a, b) => (b.ticketStats?.total ?? 0) - (a.ticketStats?.total ?? 0));
  },
});

/** List of agent users (for the assignee dropdown). Agents only. */
export const listAgents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    if (me?.role !== ROLES.ADMIN) throw new Error("Agents only");

    const users = await ctx.db.query("users").collect();
    return users.filter((u) => u.role === ROLES.ADMIN);
  },
});

/**
 * Demo bootstrap: the very first user to sign up becomes the admin/agent.
 * Idempotent — only acts when there are zero admins and the caller has no role.
 */
export const ensureInitialAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return false;
    const me = await ctx.db.get(userId);
    if (me && me.role) return me.role === ROLES.ADMIN;

    const admins = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), ROLES.ADMIN))
      .collect();
    if (admins.length > 0) return false;

    await ctx.db.patch(userId, { role: ROLES.ADMIN });
    return true;
  },
});

/** Promote / demote a user. Agents only. Guards against demoting the last admin. */
export const setRole = mutation({
  args: { userId: v.id("users"), role: roleValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    if (me?.role !== ROLES.ADMIN) throw new Error("Agents only");

    const target = await ctx.db.get(args.userId);
    if (!target) throw new Error("User not found");

    // prevent demoting the last remaining admin
    if (
      target.role === ROLES.ADMIN &&
      args.role !== ROLES.ADMIN
    ) {
      const admins = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), ROLES.ADMIN))
        .collect();
      if (admins.length <= 1) throw new Error("Cannot demote the last agent");
    }

    await ctx.db.patch(args.userId, { role: args.role });
    return args.userId;
  },
});
