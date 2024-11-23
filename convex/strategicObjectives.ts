import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createStrategicObjective = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    teamId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const objective = await ctx.db.insert("strategicObjectives", {
      ...args,
      progress: 0,
      createdBy: identity.subject,
    });

    return objective;
  },
});

export const getStrategicObjectives = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const objectives = await ctx.db
      .query("strategicObjectives")
      .collect();

    return objectives;
  },
});

export const updateProgress = mutation({
  args: {
    id: v.id("strategicObjectives"),
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