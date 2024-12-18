import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAllowedTeamIds } from "./lib/permissions";

export const createStrategicObjective = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    teamId: v.id("teams"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const now = new Date().toISOString();
    
    const objective = await ctx.db.insert("strategicObjectives", {
      ...args,
      progress: 0,
      status: "not_started",
      createdBy: identity.subject,
      createdAt: now,
      updatedAt: now,
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

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    // If no allowed teams, return empty array
    if (allowedTeamIds.length === 0) {
      return [];
    }

    const objectives = await ctx.db
      .query("strategicObjectives")
      .filter(q => 
        q.or(
          ...allowedTeamIds.map(teamId => 
            q.eq(q.field("teamId"), teamId)
          )
        )
      )
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

    // Verify user has access to this objective
    const objective = await ctx.db.get(args.id);
    if (!objective) {
      throw new Error("Objective not found");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);
    if (!allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to update this objective");
    }

    await ctx.db.patch(args.id, { 
      progress: args.progress,
      updatedAt: new Date().toISOString()
    });
  },
});

/**
 * Get dependencies for a strategic objective
 */
export const getDependencies = query({
  args: {
    objectiveId: v.id("strategicObjectives"),
  },
  handler: async (ctx, args) => {
    // Get user's allowed teams
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    // First verify user has access to the objective
    const objective = await ctx.db.get(args.objectiveId);
    if (!objective || !allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to view this objective");
    }

    // Get dependencies where this objective is either source or target
    const sourceDeps = await ctx.db
      .query("dependencies")
      .withIndex("by_source", (q) => q.eq("source", args.objectiveId))
      .collect();

    const targetDeps = await ctx.db
      .query("dependencies")
      .withIndex("by_target", (q) => q.eq("target", args.objectiveId))
      .collect();

    return {
      sourceOf: sourceDeps,
      targetOf: targetDeps
    };
  },
});

/**
 * Get a single strategic objective by ID
 */
export const getStrategicObjective = query({
  args: {
    id: v.id("strategicObjectives"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    const objective = await ctx.db.get(args.id);
    if (!objective || !allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to view this objective");
    }

    return objective;
  },
});

/**
 * Add a dependency between two objectives
 */
export const addDependency = mutation({
  args: {
    sourceId: v.id("strategicObjectives"),
    targetId: v.id("strategicObjectives"),
    type: v.union(
      v.literal("blocks"),
      v.literal("depends_on"),
      v.literal("related_to")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    // Verify access to both objectives
    const source = await ctx.db.get(args.sourceId);
    const target = await ctx.db.get(args.targetId);

    if (!source || !target || 
        !allowedTeamIds.includes(source.teamId) || 
        !allowedTeamIds.includes(target.teamId)) {
      throw new Error("Not authorized to create this dependency");
    }

    // Check if dependency already exists
    const existing = await ctx.db
      .query("dependencies")
      .filter(q => 
        q.and(
          q.eq(q.field("source"), args.sourceId),
          q.eq(q.field("target"), args.targetId)
        )
      )
      .first();

    if (existing) {
      throw new Error("Dependency already exists");
    }

    const now = new Date().toISOString();

    // Create the dependency
    return await ctx.db.insert("dependencies", {
      source: args.sourceId,
      target: args.targetId,
      type: args.type,
      createdBy: identity.subject,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Remove a dependency between two objectives
 */
export const removeDependency = mutation({
  args: {
    sourceId: v.id("strategicObjectives"),
    targetId: v.id("strategicObjectives"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    // Verify access to both objectives
    const source = await ctx.db.get(args.sourceId);
    const target = await ctx.db.get(args.targetId);

    if (!source || !target || 
        !allowedTeamIds.includes(source.teamId) || 
        !allowedTeamIds.includes(target.teamId)) {
      throw new Error("Not authorized to remove this dependency");
    }

    // Find and delete the dependency
    const dependency = await ctx.db
      .query("dependencies")
      .filter(q => 
        q.and(
          q.eq(q.field("source"), args.sourceId),
          q.eq(q.field("target"), args.targetId)
        )
      )
      .first();

    if (!dependency) {
      throw new Error("Dependency not found");
    }

    await ctx.db.delete(dependency._id);
  },
});

/**
 * Create a milestone for a strategic objective
 */
export const createMilestone = mutation({
  args: {
    objectiveId: v.id("strategicObjectives"),
    title: v.string(),
    description: v.string(),
    dueDate: v.string(),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    // Verify access to the objective
    const objective = await ctx.db.get(args.objectiveId);
    if (!objective || !allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to create milestones for this objective");
    }

    const now = new Date().toISOString();

    return await ctx.db.insert("milestones", {
      ...args,
      createdBy: identity.subject,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Update a milestone's status
 */
export const updateMilestoneStatus = mutation({
  args: {
    milestoneId: v.id("milestones"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const milestone = await ctx.db.get(args.milestoneId);
    if (!milestone) {
      throw new Error("Milestone not found");
    }

    const objective = await ctx.db.get(milestone.objectiveId);
    if (!objective) {
      throw new Error("Parent objective not found");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);
    if (!allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to update this milestone");
    }

    await ctx.db.patch(args.milestoneId, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });
  },
});

/**
 * Delete a milestone
 */
export const deleteMilestone = mutation({
  args: {
    milestoneId: v.id("milestones"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const milestone = await ctx.db.get(args.milestoneId);
    if (!milestone) {
      throw new Error("Milestone not found");
    }

    const objective = await ctx.db.get(milestone.objectiveId);
    if (!objective) {
      throw new Error("Parent objective not found");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);
    if (!allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to delete this milestone");
    }

    await ctx.db.delete(args.milestoneId);
  },
});

/**
 * Get milestones for a strategic objective
 */
export const getMilestones = query({
  args: {
    objectiveId: v.id("strategicObjectives"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const allowedTeamIds = await getAllowedTeamIds(ctx, identity.subject);

    // Verify access to the objective
    const objective = await ctx.db.get(args.objectiveId);
    if (!objective || !allowedTeamIds.includes(objective.teamId)) {
      throw new Error("Not authorized to view these milestones");
    }

    // Get all milestones for this objective
    return await ctx.db
      .query("milestones")
      .withIndex("by_objective", (q) => q.eq("objectiveId", args.objectiveId))
      .collect();
  },
});