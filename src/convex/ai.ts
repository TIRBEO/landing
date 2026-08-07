import { action, v } from "./_generated/server";

export const draftReply = action({
  args: { prompt: v.string() },
  handler: async (_ctx, { prompt }) => {
    return { reply: "" };
  },
});
