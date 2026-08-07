import { httpAction } from "./_generated/server";

export const health = httpAction(async (_ctx, _request) => {
  return new Response("OK", { status: 200 });
});
