import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const createTeam = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.insert("teams", {
      name: args.name,
      description: args.description,
      createdBy: identity.subject,
      members: [{
        userId: identity.subject,
        role: "admin",
        email: identity.email!,
        name: identity.name!,
      }],
    });

    return team;
  },
});

export const getTeams = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const teams = await ctx.db
      .query("teams")
      .collect();

    return teams;
  },
});

export const inviteMember = mutation({
  args: {
    teamId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("leader"), v.literal("member")),
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

    const currentUser = team.members.find(m => m.userId === identity.subject);
    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "leader")) {
      throw new Error("Not authorized to invite members");
    }

    // Generate a unique invitation token
    const invitationToken = Math.random().toString(36).substring(2);

    // Store the invitation in the database
    await ctx.db.insert("invitations", {
      teamId: args.teamId,
      email: args.email,
      name: args.name,
      role: args.role,
      token: invitationToken,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    // Send invitation email
    await ctx.scheduler.runAfter(0, internal.email.sendInvitation, {
      email: args.email,
      name: args.name,
      teamName: team.name,
      invitationToken,
    });

    return { success: true };
  },
});

export const acceptInvitation = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find and validate invitation
    const invitation = await ctx.db
      .query("invitations")
      .filter((q) => q.eq(q.field("token"), args.token))
      .unique();

    if (!invitation || invitation.status !== "pending" || new Date(invitation.expiresAt) < new Date()) {
      throw new Error("Invalid or expired invitation");
    }

    if (invitation.email !== identity.email) {
      throw new Error("Email mismatch");
    }

    // Update team members
    const team = await ctx.db
      .query("teams")
      .filter((q) => q.eq(q.field("_id"), invitation.teamId))
      .unique();

    if (!team) {
      throw new Error("Team not found");
    }

    await ctx.db.patch(team._id, {
      members: [...team.members, {
        userId: identity.subject,
        role: invitation.role,
        email: identity.email!,
        name: identity.name!,
      }],
    });

    // Mark invitation as accepted
    await ctx.db.patch(invitation._id, {
      status: "accepted",
    });

    return { success: true };
  },
});