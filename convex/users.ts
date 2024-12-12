import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Define the super admin email constant
const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Return null for empty userId
    if (!args.userId) return null;

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
    if (!identity || identity.email !== SUPER_ADMIN_EMAIL) {
      return null;
    }

    // Check if super admin already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create super admin user
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: SUPER_ADMIN_EMAIL,
      name: "Kushtrim Puka",
      role: "super_admin" as const,
      organizationId: "SYSTEM" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      role: args.email === SUPER_ADMIN_EMAIL ? "super_admin" : args.role,
      organizationId: args.email === SUPER_ADMIN_EMAIL ? "SYSTEM" : args.organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
}); 