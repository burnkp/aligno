import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Define the super admin email constant
const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

// Helper function to check if user is super admin
export const isSuperAdmin = async (db: any, userId: string) => {
  const user = await db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  return user?.role === "super_admin";
};

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Return null for empty userId
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    // If user doesn't exist but email is super admin, create super admin user
    if (!user) {
      const identity = await ctx.auth.getUserIdentity();
      if (identity?.email === SUPER_ADMIN_EMAIL) {
        const userData = {
          userId: args.userId,
          email: SUPER_ADMIN_EMAIL,
          name: "Kushtrim Puka",
          role: "super_admin" as const,
          organizationId: "SYSTEM" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const id = await ctx.db.insert("users", userData);
        return {
          ...userData,
          _id: id,
          _creationTime: Date.now(),
        };
      }
    }

    return user;
  },
});

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("org_admin"), v.literal("team_leader"), v.literal("team_member")),
    organizationId: v.union(v.literal("SYSTEM"), v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Handle super admin creation
    if (args.email === SUPER_ADMIN_EMAIL) {
      const userData = {
        userId: args.userId,
        email: args.email,
        name: args.name,
        role: "super_admin" as const,
        organizationId: "SYSTEM" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return await ctx.db.insert("users", userData);
    }

    // For other users, create with provided role and organization
    const userData = {
      userId: args.userId,
      email: args.email,
      name: args.name,
      role: args.role,
      organizationId: args.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await ctx.db.insert("users", userData);
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    if (!user || user.role !== "super_admin") {
      throw new Error("Not authorized");
    }

    return await ctx.db.query("users").collect();
  },
}); 