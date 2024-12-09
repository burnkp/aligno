import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkPermission, isSuperAdmin, logAuditEvent } from "./lib/permissions";
import { UserRole } from "./lib/permissions";

/**
 * Create a new user
 * Only super_admin can create org_admin users
 * Only super_admin and org_admin can create team_leader users
 * Only super_admin, org_admin, and team_leader can create team_member users
 */
export const createUser = mutation({
  args: {
    userId: v.string(), // Clerk User ID
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member")
    ),
    organizationId: v.id("organizations"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const creatorId = identity.subject;
    const { userId, email, name, role, organizationId } = args;

    // Get creator's details
    const creator = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", creatorId))
      .first();

    if (!creator) {
      throw new Error("Creator not found");
    }

    // Check role-based permissions
    if (role === "org_admin" && !creator.role.includes("super_admin")) {
      throw new Error("Only super admin can create org admin users");
    }

    if (
      role === "team_leader" &&
      !["super_admin", "org_admin"].includes(creator.role)
    ) {
      throw new Error("Only super admin and org admin can create team leader users");
    }

    if (
      role === "team_member" &&
      !["super_admin", "org_admin", "team_leader"].includes(creator.role)
    ) {
      throw new Error(
        "Only super admin, org admin, and team leader can create team member users"
      );
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create the user
    const newUserId = await ctx.db.insert("users", {
      userId,
      email,
      name,
      role,
      organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Log the action
    await logAuditEvent(ctx.db, {
      userId: creatorId,
      action: "create",
      resource: "user",
      details: { newUserId, email, role },
      organizationId,
    });

    return newUserId;
  },
});

/**
 * Update a user
 * super_admin can update any user
 * org_admin can update users in their organization
 * team_leader can update team_member users in their team
 * team_member can only update their own profile
 */
export const updateUser = mutation({
  args: {
    userId: v.string(), // Clerk User ID
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      role: v.optional(
        v.union(
          v.literal("org_admin"),
          v.literal("team_leader"),
          v.literal("team_member")
        )
      ),
    }),
  },
  async handler(ctx, args) {
    const { userId: targetUserId, updates } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const updaterId = identity.subject;

    // Get target user
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", targetUserId))
      .first();

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Check permissions
    const hasPermission = await checkPermission(ctx.db, {
      userId: updaterId,
      action: "update",
      resource: "user",
      organizationId: targetUser.organizationId,
    });

    if (!hasPermission) {
      throw new Error("Not authorized to update this user");
    }

    // Update the user
    const id = targetUser._id;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Log the action
    await logAuditEvent(ctx.db, {
      userId: updaterId,
      action: "update",
      resource: "user",
      details: { targetUserId, updates },
      organizationId: targetUser.organizationId,
    });

    return id;
  },
});

/**
 * Get all users in an organization
 * super_admin can view users in any organization
 * org_admin can view users in their organization
 * team_leader can view users in their team
 */
export const getOrganizationUsers = query({
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
      resource: "user",
      organizationId,
    });

    if (!hasPermission) {
      throw new Error("Not authorized to view users in this organization");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
  },
});

/**
 * Get a user by ID
 * super_admin can view any user
 * org_admin can view users in their organization
 * team_leader can view users in their team
 * team_member can view their own profile
 */
export const getUser = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const { userId: targetUserId } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const requesterId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", targetUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check permissions
    const hasPermission = await checkPermission(ctx.db, {
      userId: requesterId,
      action: "read",
      resource: "user",
      organizationId: user.organizationId,
    });

    if (!hasPermission && requesterId !== targetUserId) {
      throw new Error("Not authorized to view this user");
    }

    return user;
  },
}); 