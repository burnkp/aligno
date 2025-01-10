import { v } from "convex/values";
import { mutation, query, DatabaseReader } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import logger from "@/utils/logger";

// Define the super admin email constant
const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

// Helper functions
function validateEmail(email: string): boolean {
  return email.toLowerCase() === email && email.includes("@");
}

function checkSuperAdmin(email: string): boolean {
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Return null for empty userId
    if (!args.userId) return null;

    // Log the user lookup attempt
    logger.info("Looking up user", { userId: args.userId });

    // Check for existing user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    return user;
  },
});

export const ensureSuperAdmin = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Validate super admin email
    if (!identity.email || identity.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      logger.warn("Unauthorized super admin access attempt", {
        email: identity.email,
        userId: args.userId
      });
      return null;
    }

    // Check if super admin already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      // Update existing super admin if needed
      if (existingUser.role !== "super_admin") {
        await ctx.db.patch(existingUser._id, {
          role: "super_admin" as const,
          organizationId: "SYSTEM" as const,
          updatedAt: new Date().toISOString()
        });
      }
      return existingUser._id;
    }

    // Create super admin user
    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: SUPER_ADMIN_EMAIL.toLowerCase(),
      name: "Kushtrim Puka",
      role: "super_admin" as const,
      organizationId: "SYSTEM" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logger.info("Super admin user created", { userId });
    return userId;
  },
});

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("org_admin"), v.literal("team_leader"), v.literal("team_member")),
    organizationId: v.union(v.literal("SYSTEM"), v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Validate email format
    if (!validateEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    // Normalize email to lowercase
    const normalizedEmail = args.email.toLowerCase();

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Handle super admin creation
    if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
      if (identity.email !== SUPER_ADMIN_EMAIL) {
        throw new Error("Unauthorized super admin creation attempt");
      }
      return await ctx.db.insert("users", {
        userId: args.userId,
        email: SUPER_ADMIN_EMAIL.toLowerCase(),
        name: "Kushtrim Puka",
        role: "super_admin" as const,
        organizationId: "SYSTEM" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Create regular user
    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: normalizedEmail,
      name: args.name,
      role: args.role,
      organizationId: args.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logger.info("User created", {
      userId,
      role: args.role,
      organizationId: args.organizationId
    });

    return userId;
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Only super admin can get all users
    const isSuperAdminUser = checkSuperAdmin(identity.email ?? "");
    if (!isSuperAdminUser) {
      throw new Error("Not authorized to view all users");
    }

    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.string(),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      role: v.optional(v.union(
        v.literal("super_admin"),
        v.literal("org_admin"),
        v.literal("team_leader"),
        v.literal("team_member")
      )),
      organizationId: v.optional(v.union(v.literal("SYSTEM"), v.id("organizations"))),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Only super admin can update users
    const isSuperAdminUser = checkSuperAdmin(identity.email ?? "");
    if (!isSuperAdminUser) {
      throw new Error("Only super admin can update users");
    }

    // Find the user to update
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Prevent modifying super admin role
    if (user.email === SUPER_ADMIN_EMAIL && args.updates.role && args.updates.role !== "super_admin") {
      throw new Error("Cannot modify super admin role");
    }

    // If email is being updated, check for uniqueness and validate format
    if (args.updates.email !== undefined) {
      if (!validateEmail(args.updates.email)) {
        throw new Error("Invalid email format");
      }

      const newEmail = args.updates.email.toLowerCase();
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", newEmail))
        .first();

      if (existingUser && existingUser._id !== user._id) {
        throw new Error("Email already in use");
      }

      // Ensure email is stored in lowercase
      args.updates.email = newEmail;
    }

    // Update the user
    await ctx.db.patch(user._id, {
      ...args.updates,
      updatedAt: new Date().toISOString(),
    });

    logger.info("User updated", {
      userId: args.userId,
      updates: args.updates
    });

    return true;
  },
});

// Get organization users
export const getOrganizationUsers = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the requesting user
    const requestingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", identity.subject))
      .first();

    if (!requestingUser) {
      throw new Error("User not found");
    }

    // Check if user has access to this organization
    const isSuperAdmin = checkSuperAdmin(identity.email ?? "");
    const hasAccess = isSuperAdmin || requestingUser.organizationId === args.organizationId;

    if (!hasAccess) {
      throw new Error("Not authorized to view organization users");
    }

    // Get all users in the organization
    const users = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    return users;
  },
});

export const ensureOrgAdmin = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Validate email format and match
    if (!validateEmail(args.email) || identity.email?.toLowerCase() !== args.email.toLowerCase()) {
      throw new Error("Invalid or mismatched email");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const userName = identity.firstName ? String(identity.firstName) : "Unknown";

    // Create the organization first
    const orgId = await ctx.db.insert("organizations", {
      name: args.orgName,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscription: {
        plan: "free",
        status: "active",
        startDate: new Date().toISOString(),
        endDate: undefined,
      },
      contactPerson: {
        name: userName,
        email: args.email.toLowerCase(),
      },
    });

    // Create the user as org_admin
    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email.toLowerCase(),
      name: userName,
      role: "org_admin" as const,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logger.info("Organization admin created", {
      userId,
      orgId,
      orgName: args.orgName
    });

    return userId;
  },
});

export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string())
  },
  async handler(ctx, args) {
    const { userId, email, name, imageUrl } = args;
    
    // Check for super admin
    const isSuperAdmin = email === SUPER_ADMIN_EMAIL;
    
    // Get existing user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("userId", userId))
      .first();
      
    if (existingUser) {
      return await ctx.db.patch(existingUser._id, {
        email,
        name,
        imageUrl,
        updatedAt: new Date().toISOString()
      });
    }
    
    // Create new user with pending state
    return await ctx.db.insert("users", {
      userId,
      email,
      name,
      imageUrl,
      role: isSuperAdmin ? "super_admin" : "pending",
      organizationId: isSuperAdmin ? "SYSTEM" : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}); 