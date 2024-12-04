import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

    // Get team info
    const team = await ctx.db.get(invitation.teamId as Id<"teams">);
    
    return {
      ...invitation,
      teamName: team?.name || "Unknown Team",
    };
  },
});

// Create new invitation
export const create = mutation({
  args: {
    teamId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("leader"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if user has permission to invite members
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("_id"), args.teamId))
      .unique();

    if (!team) {
      throw new Error("Team not found");
    }

    // Check if inviter is admin or leader
    const currentUser = team.members.find(m => m.userId === identity.subject);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "leader")) {
      throw new Error("Not authorized to invite members");
    }

    // Generate a unique invitation token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Store the invitation
    const invitation = await ctx.db.insert("invitations", {
      ...args,
      token,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      createdAt: new Date().toISOString(),
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

    // Get invitation
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

    // Update team members
    const team = await ctx.db.get(invitation.teamId as Id<"teams">);
    if (!team) {
      throw new Error("Team not found");
    }

    // Check if user is already a member
    const existingMember = team.members.find(m => m.userId === args.userId);
    if (existingMember) {
      throw new Error("You are already a member of this team");
    }

    // Add member to team
    await ctx.db.patch(invitation.teamId as Id<"teams">, {
      members: [
        ...team.members,
        {
          userId: args.userId,
          role: invitation.role,
          email: invitation.email,
          name: invitation.name,
        },
      ],
    });

    // Mark invitation as accepted
    await ctx.db.patch(invitation._id, {
      status: "accepted",
    });

    return { success: true };
  },
}); 