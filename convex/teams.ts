import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

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
    role: v.union(v.literal("leader"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    console.log("Starting inviteMember mutation with args:", args);
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.get(args.teamId as Id<"teams">);
    if (!team) {
      throw new Error("Team not found");
    }

    console.log("Found team:", team);
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    let invitationId: Id<"invitations"> | null = null;

    try {
      // Store the invitation in the database
      console.log("Creating invitation record...");
      invitationId = await ctx.db.insert("invitations", {
        teamId: args.teamId as Id<"teams">,
        email: args.email,
        name: args.name,
        role: args.role,
        token,
        status: "pending",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: identity.subject,
        createdAt: new Date().toISOString(),
      });
      console.log("Invitation created with ID:", invitationId);

      // Send the email
      console.log("Sending invitation email...");
      const emailResult = await ctx.scheduler.runAfter(0, internal.email.sendInvitation, {
        email: args.email,
        name: args.name,
        teamId: args.teamId,
        teamName: team.name,
        role: args.role,
        invitationToken: token,
      });
      console.log("Email result:", emailResult);

      return { success: true };
    } catch (error) {
      console.error("Failed to process invitation:", error);
      
      // If we created an invitation but failed to send email, delete it
      if (invitationId) {
        console.log("Deleting failed invitation:", invitationId);
        await ctx.db.delete(invitationId);
      }

      throw error;
    }
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

// Get user's teams with their role
export const getUserTeams = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const teams = await ctx.db
      .query("teams")
      .filter((q) => 
        q.eq(
          q.field("members"),
          identity.subject
        )
      )
      .collect();

    return teams.map(team => ({
      _id: team._id,
      name: team.name,
      role: team.members.find(m => m.userId === identity.subject)?.role
    }));
  },
});

// Get team data with objectives and KPIs
export const getTeamWithObjectives = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId as Id<"teams">);
    if (!team) throw new Error("Team not found");

    // Check if user is member of team
    const member = team.members.find(m => m.userId === identity.subject);
    if (!member) throw new Error("Not authorized");

    // Get team's objectives and KPIs
    const objectives = await ctx.db
      .query("strategicObjectives")
      .filter(q => q.eq(q.field("teamId"), args.teamId))
      .collect();

    const kpis = await ctx.db
      .query("kpis")
      .filter(q => q.eq(q.field("teamId"), args.teamId))
      .collect();

    return {
      ...team,
      objectives,
      kpis,
    };
  },
});

export const getUserRole = query({
  args: { teamId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId as Id<"teams">);
    if (!team) throw new Error("Team not found");

    const member = team.members.find(m => m.userId === identity.subject);
    if (!member) return null;

    return member.role;
  },
});