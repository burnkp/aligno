import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get KPIs by objective ID
export const getKPIsByObjective = query({
  args: { objectiveId: v.id("strategicObjectives") },
  handler: async (ctx, args) => {
    // First, get all OKRs for this objective
    const okrs = await ctx.db
      .query("operationalKeyResults")
      .withIndex("by_objective", (q) => q.eq("strategicObjectiveId", args.objectiveId))
      .collect();

    // Then get all KPIs for these OKRs
    const kpis = [];
    for (const okr of okrs) {
      const okrKpis = await ctx.db
        .query("kpis")
        .withIndex("by_okr", (q) => q.eq("operationalKeyResultId", okr._id))
        .collect();
      kpis.push(...okrKpis);
    }

    return kpis;
  },
});

// Get KPIs by various filters
export const getKPIs = query({
  args: {
    operationalKeyResultId: v.optional(v.id("operationalKeyResults")),
    teamId: v.optional(v.id("teams")),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Handle each filter case separately to maintain type safety
    if (args.operationalKeyResultId !== undefined) {
      // Store the ID to maintain type narrowing
      const okrId = args.operationalKeyResultId;
      return await ctx.db
        .query("kpis")
        .withIndex("by_okr", (q) => 
          q.eq("operationalKeyResultId", okrId)
        )
        .collect();
    }

    if (args.teamId !== undefined) {
      // Store the ID to maintain type narrowing
      const teamId = args.teamId;
      return await ctx.db
        .query("kpis")
        .withIndex("by_team", (q) => 
          q.eq("teamId", teamId)
        )
        .collect();
    }

    if (args.assignedTo !== undefined) {
      // Store the value to maintain type narrowing
      const assignedTo = args.assignedTo;
      return await ctx.db
        .query("kpis")
        .withIndex("by_assignee", (q) => 
          q.eq("assignedTo", assignedTo)
        )
        .collect();
    }

    // If no filters are provided, return all KPIs
    return await ctx.db
      .query("kpis")
      .collect();
  },
});

// Create a new KPI
export const createKPI = mutation({
  args: {
    title: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    description: v.string(),
    teamId: v.id("teams"),
    currentValue: v.number(),
    targetValue: v.number(),
    operationalKeyResultId: v.id("operationalKeyResults"),
    assignedTo: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify team exists
    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Verify OKR exists
    const okr = await ctx.db.get(args.operationalKeyResultId);
    if (!okr) {
      throw new Error("Operational Key Result not found");
    }

    // Calculate initial progress
    const progress = (args.currentValue / args.targetValue) * 100;

    // Determine initial status
    const status = progress === 0 ? "not_started" : 
                  progress >= 100 ? "completed" :
                  progress < 25 ? "at_risk" : "in_progress";

    // Create the KPI
    const kpiId = await ctx.db.insert("kpis", {
      ...args,
      progress,
      status,
      createdBy: identity.subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return kpiId;
  },
});

// Update a KPI
export const updateKPI = mutation({
  args: {
    kpiId: v.id("kpis"),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      currentValue: v.optional(v.number()),
      targetValue: v.optional(v.number()),
      assignedTo: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const kpi = await ctx.db.get(args.kpiId);
    if (!kpi) {
      throw new Error("KPI not found");
    }

    // Store current value as previous value if it's being updated
    const updates: Record<string, any> = { ...args.updates };
    if (args.updates.currentValue !== undefined) {
      updates.previousValue = kpi.currentValue;
    }

    // Calculate new progress if values are updated
    if (args.updates.currentValue !== undefined || args.updates.targetValue !== undefined) {
      const currentValue = args.updates.currentValue ?? kpi.currentValue;
      const targetValue = args.updates.targetValue ?? kpi.targetValue;
      const progress = (currentValue / targetValue) * 100;
      updates.progress = progress;

      // Update status based on new progress
      updates.status = progress === 0 ? "not_started" : 
                      progress >= 100 ? "completed" :
                      progress < 25 ? "at_risk" : "in_progress";
    }

    // Update the KPI
    await ctx.db.patch(args.kpiId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return true;
  },
});