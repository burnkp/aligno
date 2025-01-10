import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Aligno Database Schema
 * 
 * This schema defines the core data structures for the Aligno multi-tenant system.
 * It includes organizations, users, teams, and their relationships.
 */

export default defineSchema({
  // Organizations table - Stores customer/organization data
  organizations: defineTable({
    name: v.string(),
    contactPerson: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    status: v.union(v.literal("active"), v.literal("inactive")),
    subscription: v.object({
      plan: v.string(),
      status: v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("trial"),
        v.literal("expired")
      ),
      startDate: v.string(),
      endDate: v.optional(v.string()),
    }),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),

  // Users table - Stores user data with role and organization mapping
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.union(
      v.literal("super_admin"),
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member"),
      v.literal("pending")
    ),
    organizationId: v.optional(v.union(v.literal("SYSTEM"), v.id("organizations"))),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_clerk_id", ["userId"])
    .index("by_email", ["email"])
    .index("by_organization", ["organizationId"]),

  // Teams table - Stores team data with organization mapping
  teams: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
    leaderId: v.string(),
    createdBy: v.string(),
    settings: v.optional(
      v.object({
        isPrivate: v.boolean(),
        allowMemberInvites: v.boolean(),
        requireLeaderApproval: v.boolean(),
      })
    ),
    members: v.array(
      v.object({
        userId: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.union(
          v.literal("super_admin"),
          v.literal("org_admin"),
          v.literal("team_leader"),
          v.literal("team_member")
        ),
        joinedAt: v.string(),
      })
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_leader", ["leaderId"]),

  // Strategic Objectives table - Stores high-level objectives
  strategicObjectives: defineTable({
    title: v.string(),
    description: v.string(),
    progress: v.number(),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("blocked")
    ),
    startDate: v.string(),
    endDate: v.string(),
    teamId: v.id("teams"),
    createdBy: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_team", ["teamId"])
    .index("by_date", ["startDate", "endDate"])
    .index("by_status", ["status"]),

  // Dependencies table - Stores relationships between objectives
  dependencies: defineTable({
    source: v.id("strategicObjectives"),
    target: v.id("strategicObjectives"),
    type: v.union(
      v.literal("blocks"),
      v.literal("depends_on"),
      v.literal("related_to")
    ),
    createdBy: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_source", ["source"])
    .index("by_target", ["target"]),

  // Operational Key Results table - Stores OKRs linked to strategic objectives
  operationalKeyResults: defineTable({
    title: v.string(),
    description: v.string(),
    progress: v.number(),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("blocked")
    ),
    startDate: v.string(),
    endDate: v.string(),
    teamId: v.id("teams"),
    strategicObjectiveId: v.id("strategicObjectives"),
    createdBy: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_team", ["teamId"])
    .index("by_objective", ["strategicObjectiveId"])
    .index("by_status", ["status"]),

  // KPIs table - Stores key performance indicators
  kpis: defineTable({
    title: v.string(),
    description: v.string(),
    currentValue: v.number(),
    targetValue: v.number(),
    previousValue: v.optional(v.number()),
    progress: v.number(),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("at_risk")
    ),
    startDate: v.string(),
    endDate: v.string(),
    teamId: v.id("teams"),
    operationalKeyResultId: v.id("operationalKeyResults"),
    assignedTo: v.string(),
    createdBy: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_team", ["teamId"])
    .index("by_okr", ["operationalKeyResultId"])
    .index("by_assignee", ["assignedTo"])
    .index("by_status", ["status"]),

  // Invitations table - Stores team invitations
  invitations: defineTable({
    teamId: v.id("teams"),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member")
    ),
    token: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("expired"),
      v.literal("bounced")
    ),
    expiresAt: v.string(),
    createdAt: v.string(),
    createdBy: v.string(),
    acceptedAt: v.optional(v.string()),
    acceptedBy: v.optional(v.string()),
    updatedAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_team", ["teamId"])
    .index("by_status", ["status"]),

  // Audit logs table - Tracks important system events
  auditLogs: defineTable({
    userId: v.string(),
    action: v.string(),
    resource: v.string(),
    details: v.any(),
    organizationId: v.optional(v.id("organizations")),
    timestamp: v.string(),
  }).index("by_organization", ["organizationId"]),

  // Email logs table - Tracks email delivery attempts and status
  emailLogs: defineTable({
    email: v.string(),
    teamId: v.string(),
    status: v.string(),
    error: v.optional(v.string()),
    details: v.optional(v.string()),
    timestamp: v.string(),
    environment: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_team", ["teamId"])
    .index("by_status", ["status"]),

  // Milestones table - Stores milestones for strategic objectives
  milestones: defineTable({
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
    createdBy: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_objective", ["objectiveId"])
    .index("by_status", ["status"])
    .index("by_due_date", ["dueDate"]),
});