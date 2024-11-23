import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Initialize any required data here
    return { success: true };
  },
});