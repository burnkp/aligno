import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return {
      message: "Convex connection successful!",
      timestamp: new Date().toISOString(),
      user: identity ? {
        email: identity.email,
        name: identity.name
      } : null
    };
  },
}); 