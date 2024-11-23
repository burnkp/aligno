import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOperationalKeyResult = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    strategicObjectiveId: v.id("strategicObjectives"),
    teamId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const okr = await ctx.db.insert("operationalKeyResults", {
      ...args,
      progress: 0,
      createdBy: identity.subject,
    });

    return okr;
  },
});

export const getOperationalKeyResults = query({
  args: {
    strategicObjectiveId: v.optional(v.id("strategicObjectives")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let query = ctx.db.query("operationalKeyResults");
    
    if (args.strategicObjectiveId) {
      query = query.filter((q) => 
        q.eq(q.field("strategicObjectiveId"), args.strategicObjectiveId)
      );
    }

    return await query.collect();
  },
});

export const updateProgress = mutation({
  args: {
    id: v.id("operationalKeyResults"),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, { progress: args.progress });
  },
});