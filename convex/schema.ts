import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  teams: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    members: v.array(v.object({
      userId: v.string(),
      role: v.union(v.literal("admin"), v.literal("leader"), v.literal("member")),
      email: v.string(),
      name: v.string(),
    })),
  }).index("by_member", ["members"]),

  invitations: defineTable({
    email: v.string(),
    name: v.string(),
    teamId: v.id("teams"),
    role: v.union(v.literal("leader"), v.literal("member")),
    token: v.string(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    expiresAt: v.string(),
    createdBy: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    acceptedAt: v.optional(v.string()),
  }).index("by_token", ["token"]),

  strategicObjectives: defineTable({
    title: v.string(),
    description: v.string(),
    teamId: v.id("teams"),
    progress: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    createdBy: v.string(),
  }).index("by_team", ["teamId"]),

  kpis: defineTable({
    title: v.string(),
    description: v.string(),
    currentValue: v.number(),
    targetValue: v.number(),
    progress: v.number(),
    operationalKeyResultId: v.id("operationalKeyResults"),
    assignedTo: v.string(),
    teamId: v.id("teams"),
    startDate: v.string(),
    endDate: v.string(),
    createdBy: v.string(),
    updatedAt: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  })
  .index("by_team", ["teamId"])
  .index("by_assigned", ["assignedTo"]),

  operationalKeyResults: defineTable({
    title: v.string(),
    description: v.string(),
    strategicObjectiveId: v.id("strategicObjectives"),
    teamId: v.id("teams"),
    progress: v.float64(),
    startDate: v.string(),
    endDate: v.string(),
    createdBy: v.string(),
  }).index("by_team", ["teamId"]),

  emailLogs: defineTable({
    email: v.string(),
    teamId: v.string(),
    status: v.string(),
    error: v.optional(v.string()),
    details: v.optional(v.string()),
    timestamp: v.string(),
    environment: v.string(),
  }).index("by_email", ["email"]),
});