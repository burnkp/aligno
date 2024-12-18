import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { generateToken } from "./utils";

// Get invitation by token
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (new Date(invitation.expiresAt) < new Date()) {
      return { ...invitation, status: "expired" };
    }

    return invitation;
  },
});

// Update expired status
export const updateExpiredStatus = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      return null;
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      await ctx.db.patch(invitation._id, {
        status: "expired"
      });
    }

    return invitation;
  },
});

// Create new invitation
export const createInvitation = mutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("leader"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const token = generateToken();
    const now = new Date().toISOString();

    // Store the invitation with all required fields
    const invitation = await ctx.db.insert("invitations", {
      teamId: args.teamId,
      email: args.email,
      name: args.name,
      role: args.role,
      token,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
      updatedAt: now,
      createdBy: identity.subject,
    });

    return { invitation, token };
  },
});

// Accept invitation
export const accept = mutation({
  args: { 
    token: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      throw new Error("Invitation has expired");
    }

    const team = await ctx.db.get(invitation.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const existingMember = team.members.find(m => m.userId === args.userId);
    if (existingMember) {
      throw new Error("You are already a member of this team");
    }

    const now = new Date().toISOString();

    // Add member to team with all required fields
    await ctx.db.patch(invitation.teamId, {
      members: [
        ...team.members,
        {
          userId: args.userId,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          joinedAt: now,
        },
      ],
    });

    // Update invitation status with all required fields
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedAt: now,
      acceptedBy: args.userId,
      updatedAt: now,
    });

    return { success: true };
  },
});

// Mark email as bounced
export const markEmailBounced = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Find all pending invitations for this email
    const invitations = await ctx.db
      .query("invitations")
      .filter((q) => 
        q.and(
          q.eq(q.field("email"), args.email),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    // Update all pending invitations to bounced status
    for (const invitation of invitations) {
      await ctx.db.patch(invitation._id, {
        status: "bounced",
        updatedAt: new Date().toISOString(),
      });
    }

    return { success: true, updatedCount: invitations.length };
  },
}); 