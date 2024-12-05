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
    userId: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the invitation
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      throw new Error("Invalid invitation token");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      throw new Error("Invitation has expired");
    }

    // Get the team
    const team = await ctx.db.get(invitation.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    // Check if user is already a member of this specific team
    const existingMembership = team.members.find(member => 
      member.userId === args.userId && 
      member.email === args.userEmail
    );

    if (existingMembership) {
      // If they're already a member of this team, redirect them
      return {
        success: true,
        teamId: invitation.teamId,
        alreadyMember: true
      };
    }

    const now = new Date().toISOString();

    // Add user to team members
    await ctx.db.patch(invitation.teamId, {
      members: [
        ...team.members,
        {
          userId: args.userId,
          role: invitation.role,
          email: args.userEmail,
          name: identity.name || invitation.name,
          joinedAt: now,
        },
      ],
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedAt: now,
      acceptedBy: args.userId,
    });

    return {
      success: true,
      teamId: invitation.teamId,
      alreadyMember: false
    };
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

// Add this query to fetch team member's data
export const getTeamMemberData = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get team
    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    // Verify user is a team member
    const isMember = team.members.some(m => m.userId === identity.subject);
    if (!isMember) throw new Error("Not authorized");

    // Get team KPIs and OKRs
    const kpis = await ctx.db
      .query("kpis")
      .withIndex("by_team", q => q.eq("teamId", args.teamId))
      .collect();

    const okrs = await ctx.db
      .query("objectives")
      .withIndex("by_team", q => q.eq("teamId", args.teamId))
      .collect();

    return {
      team,
      kpis,
      okrs,
      userRole: team.members.find(m => m.userId === identity.subject)?.role
    };
  },
});

export const getTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }
    return team;
  },
});

export const getTeamWithData = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

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
      team,
      objectives,
      kpis,
    };
  },
});