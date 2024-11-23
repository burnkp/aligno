import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    members: v.array(
      v.object({
        userId: v.string(),
        role: v.union(v.literal("admin"), v.literal("leader"), v.literal("member")),
        email: v.string(),
        name: v.string(),
      })
    ),
  }),
  
  invitations: defineTable({
    teamId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("leader"), v.literal("member")),
    token: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    expiresAt: v.string(),
  }).index("by_token", ["token"]),

  strategicObjectives: defineTable({
    title: v.string(),
    description: v.string(),
    progress: v.number(),
    teamId: v.string(),
    createdBy: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  }),

  operationalKeyResults: defineTable({
    title: v.string(),
    description: v.string(),
    progress: v.number(),
    strategicObjectiveId: v.id("strategicObjectives"),
    teamId: v.string(),
    createdBy: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  }),

  kpis: defineTable({
    title: v.string(),
    description: v.string(),
    currentValue: v.number(),
    targetValue: v.number(),
    progress: v.number(),
    operationalKeyResultId: v.id("operationalKeyResults"),
    assignedTo: v.string(),
    teamId: v.string(),
    createdBy: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  }),

  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("leader"), v.literal("member")),
    teamIds: v.array(v.string()),
  }).index("by_userId", ["userId"]),
});