import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";

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
      status: "active",
      subscription: {
        plan: "trial",
        status: "active",
        startDate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create the initial admin user
    const userId = await ctx.db.insert("users", {
      userId: "pending", // Will be updated after Clerk authentication
      email: args.contactPerson.email.toLowerCase(),
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
    clerkId: v.string(),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Find the organization
    const organization = await ctx.db
      .query("organizations")
      .filter((q) => 
        q.eq(q.field("contactPerson.email"), args.email.toLowerCase())
      )
      .first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Update the user's Clerk ID
    await ctx.db.patch(user._id, {
      userId: args.clerkId,
      updatedAt: new Date().toISOString(),
    });

    // Create audit log
    await ctx.db.insert("auditLogs", {
      userId: args.clerkId,
      action: "user_clerk_id_updated",
      resource: "users",
      details: {
        userId: user._id,
        email: args.email,
        organizationId: organization._id,
      },
      organizationId: organization._id,
      timestamp: new Date().toISOString(),
    });

    return {
      userId: user._id,
      organizationId: organization._id,
    };
  },
}); 