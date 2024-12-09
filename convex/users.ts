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
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member")
    ),
    organizationId: v.id("organizations"),
  },
  async handler(ctx, args) {
    const { name, email, role, organizationId } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Check if user is super_admin
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    if (!isSuperAdminUser) {
      throw new Error("Only super admin can create users");
    }

    // Check if organization exists
    const organization = await ctx.db.get(organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Check if email is already in use
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Create the user
    const newUserId = await ctx.db.insert("users", {
      userId: "", // This will be set when the user first signs in
      name,
      email,
      role,
      organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Log the action
    await logAuditEvent(ctx.db, {
      userId,
      action: "create",
      resource: "user",
      details: { newUserId, email, role },
      organizationId,
    });

    return newUserId;
  },
});

/**
 * Update an existing user
 * Only super_admin can update org_admin users
 * Only super_admin and org_admin can update team_leader users
 * Only super_admin, org_admin, and team_leader can update team_member users
 */
export const updateUser = mutation({
  args: {
    userId: v.string(),
    updates: v.object({
      name: v.string(),
      email: v.string(),
      role: v.union(
        v.literal("org_admin"),
        v.literal("team_leader"),
        v.literal("team_member")
      ),
      organizationId: v.id("organizations"),
    }),
  },
  async handler(ctx, args) {
    const { userId, updates } = args;
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const currentUserId = identity.subject;

    // Check if user is super_admin
    const isSuperAdminUser = await isSuperAdmin(ctx.db, currentUserId);
    if (!isSuperAdminUser) {
      throw new Error("Only super admin can update users");
    }

    // Check if organization exists
    const organization = await ctx.db.get(updates.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Get the user to update
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if email is already in use by another user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", updates.email))
      .first();

    if (existingUser && existingUser._id !== user._id) {
      throw new Error("Email already in use");
    }

    // Update the user
    await ctx.db.patch(user._id, {
      name: updates.name,
      email: updates.email,
      role: updates.role,
      organizationId: updates.organizationId,
      updatedAt: new Date().toISOString(),
    });

    // Log the action
    await logAuditEvent(ctx.db, {
      userId: currentUserId,
      action: "update",
      resource: "user",
      details: {
        targetUserId: userId,
        updates,
      },
      organizationId: updates.organizationId,
    });

    return user._id;
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

/**
 * Get all users in the system
 * Only super_admin can view all users
 */
export const getAllUsers = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Check if user is super_admin
    if (!(await isSuperAdmin(ctx.db, userId))) {
      throw new Error("Only super admin can view all users");
    }

    return await ctx.db.query("users").collect();
  },
}); 