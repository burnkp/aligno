import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isSuperAdmin, isOrgAdmin } from "./lib/permissions";
import { Id } from "./_generated/dataModel";

// Import the logAuditEvent function
import { logAuditEvent } from "./lib/audit";

/**
 * Get all teams for an organization
 */
export const getOrganizationTeams = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, args.organizationId);

    // Only super admin and org admin can view all teams
    if (!isSuperAdminUser && !isOrgAdminUser) {
      throw new Error("Not authorized to view teams");
    }

    const teams = await ctx.db
      .query("teams")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    return teams;
  },
});

/**
 * Get a single team by ID with related objectives and KPIs
 */
export const getTeamWithData = query({
  args: { teamId: v.id("teams") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");
    if (!team.organizationId) throw new Error("Team has no organization");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, team.organizationId as Id<"organizations">);
    const isTeamMember = team.members.some(
      (member) => member.userId === userId
    );

    // Only super admin, org admin, and team members can view team details
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamMember) {
      throw new Error("Not authorized to view team details");
    }

    // Get team's strategic objectives
    const objectives = await ctx.db
      .query("strategicObjectives")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    // Get team's KPIs
    const kpis = await ctx.db
      .query("kpis")
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .collect();

    return {
      ...team,
      objectives,
      kpis,
    };
  },
});

/**
 * Get a single team by ID
 */
export const getTeam = query({
  args: { teamId: v.id("teams") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");
    if (!team.organizationId) throw new Error("Team has no organization");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, team.organizationId as Id<"organizations">);
    const isTeamMember = team.members.some(
      (member) => member.userId === userId
    );

    // Only super admin, org admin, and team members can view team details
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamMember) {
      throw new Error("Not authorized to view team details");
    }

    return team;
  },
});

/**
 * Create a new team
 */
export const createTeam = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    organizationId: v.id("organizations"),
    leaderId: v.string(),
    members: v.array(
      v.object({
        userId: v.string(),
        email: v.string(),
        name: v.string(),
        role: v.union(
          v.literal("super_admin"),
          v.literal("org_admin"),
          v.literal("team_leader"),
          v.literal("team_member")
        ),
        joinedAt: v.string(),
      })
    ),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, args.organizationId);

    // Only super admin and org admin can create teams
    if (!isSuperAdminUser && !isOrgAdminUser) {
      throw new Error("Not authorized to create teams");
    }

    // Check if organization exists
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");

    // Create the team
    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      description: args.description,
      organizationId: args.organizationId,
      leaderId: args.leaderId,
      members: args.members,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    });

    return teamId;
  },
});

/**
 * Update a team
 */
export const updateTeam = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    leaderId: v.optional(v.string()),
    settings: v.optional(
      v.object({
        isPrivate: v.boolean(),
        allowMemberInvites: v.boolean(),
        requireLeaderApproval: v.boolean(),
      })
    ),
    members: v.optional(
      v.array(
        v.object({
          userId: v.string(),
          email: v.string(),
          name: v.string(),
          role: v.union(
            v.literal("super_admin"),
            v.literal("org_admin"),
            v.literal("team_leader"),
            v.literal("team_member")
          ),
          joinedAt: v.string(),
        })
      )
    ),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    const currentUserId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, currentUserId);
    const isOrgAdminUser = team.organizationId ? await isOrgAdmin(ctx.db, currentUserId, team.organizationId) : false;
    const isTeamLeader = team.leaderId === currentUserId;

    // Check if user has permission to update team
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to update team");
    }

    // Update the team
    await ctx.db.patch(args.teamId, {
      ...(args.name && { name: args.name }),
      ...(args.description && { description: args.description }),
      ...(args.leaderId && { leaderId: args.leaderId }),
      ...(args.settings && { settings: args.settings }),
      ...(args.members && { members: args.members }),
      updatedAt: new Date().toISOString(),
    });

    return true;
  },
});

/**
 * Delete a team
 */
export const deleteTeam = mutation({
  args: { teamId: v.id("teams") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");
    if (!team.organizationId) throw new Error("Team has no organization");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, team.organizationId);

    // Only super admin and org admin can delete teams
    if (!isSuperAdminUser && !isOrgAdminUser) {
      throw new Error("Not authorized to delete team");
    }

    await ctx.db.delete(args.teamId);
    return true;
  },
});

/**
 * Add a member to a team
 */
export const addMember = mutation({
  args: {
    teamId: v.id("teams"),
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("super_admin"),
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member")
    ),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    const currentUserId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, currentUserId);
    const isOrgAdminUser = team.organizationId ? await isOrgAdmin(ctx.db, currentUserId, team.organizationId) : false;
    const isTeamLeader = team.leaderId === currentUserId;

    // Check if user has permission to add members
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to add team members");
    }

    // Check if user is already a member
    if (team.members.some(member => member.userId === args.userId)) {
      throw new Error("User is already a team member");
    }

    // Add the new member
    await ctx.db.patch(args.teamId, {
      members: [...team.members, {
        userId: args.userId,
        email: args.email,
        name: args.name,
        role: args.role,
        joinedAt: new Date().toISOString(),
      }],
      updatedAt: new Date().toISOString(),
    });

    return true;
  },
});

/**
 * Remove a member from a team
 */
export const removeMember = mutation({
  args: {
    teamId: v.id("teams"),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");
    if (!team.organizationId) throw new Error("Team has no organization");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, team.organizationId);
    const isTeamLeader = team.leaderId === userId;

    // Only super admin, org admin, and team leader can remove members
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to remove team members");
    }

    // Cannot remove team leader
    if (args.userId === team.leaderId) {
      throw new Error("Cannot remove team leader");
    }

    // Remove the member
    await ctx.db.patch(args.teamId, {
      members: team.members.filter((member) => member.userId !== args.userId),
      updatedAt: new Date().toISOString(),
    });

    return true;
  },
});

/**
 * Get all teams
 * Only super_admin can view all teams
 */
export const getAllTeams = query({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams;
  },
});

/**
 * Get teams for the authenticated user
 */
export const getTeams = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;

    // Find the user in the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // For new organizations, return an empty array
    // Teams will be created later through the Teams page
    return [];
  },
});

/**
 * Get user's access level for a team
 */
export const getUserAccess = query({
  args: { teamId: v.id("teams") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");
    if (!team.organizationId) throw new Error("Team has no organization");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, team.organizationId as Id<"organizations">);
    const teamMember = team.members.find(member => member.userId === userId);

    // Super admin has full access
    if (isSuperAdminUser) {
      return {
        role: "super_admin",
        canEdit: true,
        canDelete: true,
        canInvite: true,
      };
    }

    // Organization admin has full access to teams in their organization
    if (isOrgAdminUser) {
      return {
        role: "org_admin",
        canEdit: true,
        canDelete: true,
        canInvite: true,
      };
    }

    // Team leader has most permissions
    if (team.leaderId === userId) {
      return {
        role: "team_leader",
        canEdit: true,
        canDelete: false,
        canInvite: true,
      };
    }

    // Regular team member
    if (teamMember) {
      return {
        role: "team_member",
        canEdit: false,
        canDelete: false,
        canInvite: team.settings?.allowMemberInvites ?? false,
      };
    }

    throw new Error("Not authorized to access team");
  },
});

// Accept invitation
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
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      throw new Error("Invitation has expired");
    }

    // Verify email matches
    if (args.userEmail.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new Error("Email mismatch: Please use the email address where you received the invitation");
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

    // Add member to team
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
      updatedAt: now,
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedAt: now,
      acceptedBy: args.userId,
      updatedAt: now,
    });

    // Log the event
    await ctx.db.insert("auditLogs", {
      userId: args.userId,
      action: "accept_invitation",
      resource: "team",
      details: {
        teamId: team._id,
        teamName: team.name,
        role: invitation.role,
      },
      organizationId: team.organizationId,
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Create a team invitation
 */
export const createInvitation = mutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("org_admin"),
      v.literal("team_leader"),
      v.literal("team_member")
    ),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    const currentUserId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, currentUserId);
    const isOrgAdminUser = team.organizationId ? await isOrgAdmin(ctx.db, currentUserId, team.organizationId) : false;
    const isTeamLeader = team.leaderId === currentUserId;

    // Check if user has permission to invite members
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to invite team members");
    }

    // Check if user is already a member
    const existingMember = team.members.find(member => member.email.toLowerCase() === args.email.toLowerCase());
    if (existingMember) {
      throw new Error("User is already a team member");
    }

    // Check if there's a pending invitation
    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", q => q.eq("email", args.email))
      .filter(q => 
        q.and(
          q.eq(q.field("teamId"), args.teamId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    if (existingInvitation) {
      throw new Error("User already has a pending invitation");
    }

    // Generate a unique token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Create the invitation
    const invitationId = await ctx.db.insert("invitations", {
      teamId: args.teamId,
      email: args.email,
      name: args.name,
      role: args.role,
      token,
      status: "pending",
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
      createdBy: currentUserId,
      updatedAt: now.toISOString(),
    });

    // Log the invitation
    await logAuditEvent(ctx.db, {
      userId: currentUserId,
      action: "create_invitation",
      resource: "team",
      details: {
        teamId: args.teamId,
        invitationId,
        email: args.email,
        role: args.role,
      },
      organizationId: team.organizationId,
    });

    return invitationId;
  },
});

/**
 * Get pending invitations for a team
 */
export const getTeamInvitations = query({
  args: { teamId: v.id("teams") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    const currentUserId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, currentUserId);
    const isOrgAdminUser = team.organizationId ? await isOrgAdmin(ctx.db, currentUserId, team.organizationId) : false;
    const isTeamLeader = team.leaderId === currentUserId;

    // Only super admin, org admin, and team leader can view invitations
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to view team invitations");
    }

    // Get pending invitations
    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_team", q => q.eq("teamId", args.teamId))
      .filter(q => q.eq(q.field("status"), "pending"))
      .collect();

    return invitations;
  },
});