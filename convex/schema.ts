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
      status: v.string(),
      startDate: v.string(),
      endDate: v.optional(v.string()),
    }),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_status", ["status"]),

  // Users table - Stores user data with role and organization mapping
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member")
    ),
    organizationId: v.union(v.literal("SYSTEM"), v.string()),
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
    organizationId: v.optional(v.string()),
    leaderId: v.optional(v.string()),
    createdBy: v.optional(v.string()),
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
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        role: v.union(v.literal("leader"), v.literal("member"), v.literal("admin")),
        joinedAt: v.string(),
      })
    ),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_leader", ["leaderId"]),

  // Audit logs table - Tracks important system events
  auditLogs: defineTable({
    userId: v.string(),
    action: v.string(),
    resource: v.string(),
    details: v.any(),
    organizationId: v.optional(v.string()),
    timestamp: v.string(),
  }).index("by_organization", ["organizationId"]),
});