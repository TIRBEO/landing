import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Public landing-page newsletter signup. No auth required.
 * Returns whether the email was already on the list.
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { email, note }) => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new Error("Please enter a valid email address.");
    }

    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (existing) return { alreadySubscribed: true };

    await ctx.db.insert("waitlist", {
      email: normalized,
      note: note?.trim() || undefined,
      createdAt: Date.now(),
    });
    return { alreadySubscribed: false };
  },
});

/**
 * Public read of the latest waitlist signups that left a note.
 * Used by the landing page "Early believers" marquee.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db
      .query("waitlist")
      .withIndex("by_created", (q) => q.gt("createdAt", 0))
      .order("desc")
      .take(24);
    return entries.filter((e) => e.note && e.note.trim().length > 0);
  },
});
