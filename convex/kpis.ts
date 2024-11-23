import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createKPI = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    currentValue: v.number(),
    targetValue: v.number(),
    operationalKeyResultId: v.id("operationalKeyResults"),
    assignedTo: v.string(),
    teamId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const progress = (args.currentValue / args.targetValue) * 100;

    const kpi = await ctx.db.insert("kpis", {
      ...args,
      progress,
      createdBy: identity.subject,
    });

    return kpi;
  },
});

export const getKPIs = query({
  args: {
    operationalKeyResultId: v.optional(v.id("operationalKeyResults")),
    teamId: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let query = ctx.db.query("kpis");
    
    if (args.operationalKeyResultId) {
      query = query.filter((q) => 
        q.eq(q.field("operationalKeyResultId"), args.operationalKeyResultId)
      );
    }

    if (args.teamId) {
      query = query.filter((q) => 
        q.eq(q.field("teamId"), args.teamId)
      );
    }

    if (args.assignedTo) {
      query = query.filter((q) => 
        q.eq(q.field("assignedTo"), args.assignedTo)
      );
    }

    return await query.collect();
  },
});

export const updateKPIValue = mutation({
  args: {
    id: v.id("kpis"),
    currentValue: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const kpi = await ctx.db.get(args.id);
    if (!kpi) {
      throw new Error("KPI not found");
    }

    const progress = (args.currentValue / kpi.targetValue) * 100;

    await ctx.db.patch(args.id, { 
      currentValue: args.currentValue,
      progress,
    });

    return { progress };
  },
});