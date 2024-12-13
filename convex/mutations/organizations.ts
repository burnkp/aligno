import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export const create = mutation({
  args: {
    name: v.string(),
    contactPerson: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Create the organization
    const organizationId = await ctx.db.insert("organizations", {
      name: args.name,
      contactPerson: args.contactPerson,
      status: "inactive", // Requires admin approval
      subscription: {
        plan: "trial",
        status: "pending",
        startDate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create the initial admin user
    const userId = await ctx.db.insert("users", {
      userId: "pending", // Will be updated after Clerk authentication
      email: args.contactPerson.email,
      name: args.contactPerson.name,
      role: "org_admin",
      organizationId: organizationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create audit log entry
    await ctx.db.insert("auditLogs", {
      userId: "SYSTEM",
      action: "organization_created",
      resource: "organizations",
      details: {
        organizationId,
        name: args.name,
        adminEmail: args.contactPerson.email,
      },
      organizationId,
      timestamp: new Date().toISOString(),
    });

    return {
      organizationId,
      userId,
    };
  },
});

export const updateUserClerkId = mutation({
  args: {
    email: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's Clerk ID
    await ctx.db.patch(user._id, {
      userId: args.clerkUserId,
      updatedAt: new Date().toISOString(),
    });

    return user._id;
  },
}); 