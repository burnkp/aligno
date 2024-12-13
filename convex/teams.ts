import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isSuperAdmin, isOrgAdmin } from "./lib/permissions";

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
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, team.organizationId);
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
        role: v.union(v.literal("leader"), v.literal("member")),
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
    updates: v.object({
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
            role: v.union(v.literal("leader"), v.literal("member")),
            joinedAt: v.string(),
          })
        )
      ),
    }),
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

    // Only super admin, org admin, and team leader can update team
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to update team");
    }

    // If updating leader, ensure user exists
    if (args.updates.leaderId) {
      const newLeader = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("userId", args.updates.leaderId!))
        .first();

      if (!newLeader) {
        throw new Error("New team leader not found");
      }
    }

    // Update the team
    await ctx.db.patch(args.teamId, {
      ...args.updates,
      updatedAt: new Date().toISOString(),
    });

    // Log the update
    await logAuditEvent(ctx.db, {
      userId,
      action: "update",
      resource: "team",
      details: {
        teamId: args.teamId,
        updates: args.updates,
      },
      organizationId: team.organizationId,
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
    role: v.union(v.literal("leader"), v.literal("member")),
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

    // Only super admin, org admin, and team leader can add members
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamLeader) {
      throw new Error("Not authorized to add team members");
    }

    // Check if user is already a member
    const isMember = team.members.some((member) => member.userId === args.userId);
    if (isMember) {
      throw new Error("User is already a team member");
    }

    // Add the member
    await ctx.db.patch(args.teamId, {
      members: [
        ...team.members,
        {
          userId: args.userId,
          role: args.role,
          joinedAt: new Date().toISOString(),
        },
      ],
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

    // Get user's organization
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
      .first();

    if (!user) throw new Error("User not found");

    // Get teams based on user's role and organization
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, user.organizationId);

    if (isSuperAdminUser) {
      // Super admin can see all teams
      return await ctx.db.query("teams").collect();
    } else if (isOrgAdminUser) {
      // Org admin can see all teams in their organization
      return await ctx.db
        .query("teams")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .collect();
    } else {
      // Regular users can only see teams they're members of
      const allTeams = await ctx.db
        .query("teams")
        .withIndex("by_organization", (q) => q.eq("organizationId", user.organizationId))
        .collect();

      return allTeams.filter(team => 
        team.members.some(member => member.userId === userId)
      );
    }
  },
});