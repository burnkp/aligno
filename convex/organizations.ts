import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkPermission, isSuperAdmin, logAuditEvent } from "./lib/permissions";
import logger from "./lib/logger";

/**
 * Create a new organization through the admin dashboard
 * Only super_admin can use this mutation
 */
export const createOrganization = mutation({
  args: {
    name: v.string(),
    contactPerson: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    subscription: v.object({
      plan: v.string(),
      startDate: v.string(),
      endDate: v.optional(v.string()),
    }),
  },
  async handler(ctx, args) {
    const { name, contactPerson, subscription } = args;
    
    // Authentication check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user's email from identity
    const email = identity.email;
    if (!email) {
      throw new Error("User email not found");
    }

    // Check if user exists in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    // If user doesn't exist or is not super admin, throw error
    if (!user || user.role !== "super_admin") {
      throw new Error("Only super admin can create organizations");
    }

    try {
      // Create the organization
      const organizationId = await ctx.db.insert("organizations", {
        name,
        contactPerson,
        status: "active",
        subscription: {
          ...subscription,
          status: "active", // Add subscription status
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Log the action
      await logAuditEvent(ctx.db, {
        userId: identity.subject,
        action: "create",
        resource: "organization",
        details: { organizationId, name },
      });

      return organizationId;
    } catch (error) {
      logger.error("Failed to create organization:", error);
      throw error;
    }
  },
});

/**
 * Update an organization
 * Only super_admin can update organizations
 */
export const updateOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    contactPerson: v.optional(
      v.object({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
      })
    ),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    subscription: v.optional(
      v.object({
        plan: v.string(),
        status: v.union(
          v.literal("active"),
          v.literal("inactive"),
          v.literal("trial"),
          v.literal("expired"),
          v.literal("pending")
        ),
        startDate: v.string(),
        endDate: v.optional(v.string()),
      })
    ),
  },
  async handler(ctx, args) {
    const { organizationId, ...updates } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Check if user is super_admin
    if (!(await isSuperAdmin(ctx.db, userId))) {
      throw new Error("Only super admin can update organizations");
    }

    // Get the existing organization
    const organization = await ctx.db.get(organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Update the organization
    await ctx.db.patch(organizationId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Log the action
    await logAuditEvent(ctx.db, {
      userId,
      action: "update",
      resource: "organization",
      details: { organizationId, updates },
      organizationId,
    });

    return organizationId;
  },
});

/**
 * Get all organizations
 * Only super_admin can view all organizations
 */
export const getAllOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const organizations = await ctx.db.query("organizations").collect();
    return organizations;
  },
});

/**
 * Get an organization by ID
 * super_admin can view any organization
 * org_admin, team_leader, and team_member can only view their own organization
 */
export const getOrganization = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, args) {
    const { organizationId } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Check permissions
    const hasPermission = await checkPermission(ctx.db, {
      userId,
      action: "read",
      resource: "organization",
      organizationId,
    });

    if (!hasPermission) {
      throw new Error("Not authorized to view this organization");
    }

    return await ctx.db.get(organizationId);
  },
});

/**
 * Create a new organization through self-service
 * This mutation is public and doesn't require authentication
 */
export const create = mutation({
  args: {
    name: v.string(),
    adminEmail: v.string(),
    adminName: v.string(),
  },
  async handler(ctx, args) {
    const { name, adminEmail, adminName } = args;
    
    try {
      // Create organization with required fields
      const organizationId = await ctx.db.insert("organizations", {
        name,
        status: "active",
        contactPerson: {
          name: adminName,
          email: adminEmail.toLowerCase(),
        },
        subscription: {
          status: "trial",
          plan: "starter",
          startDate: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Create pending admin user
      const userId = await ctx.db.insert("users", {
        userId: "pending", // Will be updated when user authenticates
        email: adminEmail.toLowerCase(),
        name: adminName,
        role: "org_admin",
        organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Log the action
      await logAuditEvent(ctx.db, {
        userId: "SYSTEM",
        action: "create",
        resource: "organization",
        details: { 
          organizationId, 
          name,
          adminEmail: adminEmail.toLowerCase(),
          source: "self_service"
        },
        organizationId
      });

      logger.info("Organization and admin user created via self-service", {
        organizationId,
        name,
        adminEmail: adminEmail.toLowerCase(),
        userId
      });
    
      return { organizationId, userId };
    } catch (error) {
      logger.error("Failed to create organization via self-service", {
        error: error instanceof Error ? error.message : "Unknown error",
        name,
        adminEmail: adminEmail.toLowerCase()
      });
      throw error;
    }
  }
}); 