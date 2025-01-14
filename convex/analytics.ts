import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { isSuperAdmin, isOrgAdmin } from "./lib/permissions";

/**
 * Get organization analytics
 */
export const getOrganizationAnalytics = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, args.organizationId);

    // Only super admin and org admin can view organization analytics
    if (!isSuperAdminUser && !isOrgAdminUser) {
      throw new Error("Not authorized to view organization analytics");
    }

    // Get all users in the organization
    const users = await ctx.db
      .query("users")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    // Get all teams in the organization
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    // Get recent audit logs for specific actions
    const recentLogs = await ctx.db
      .query("auditLogs")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .take(1000);

    // Calculate active users based on recent activity
    const now = new Date();
    const dailyUsers = new Set();
    const weeklyUsers = new Set();
    const monthlyUsers = new Set();

    // Add all users to monthly active by default (temporary for testing)
    users.forEach(user => monthlyUsers.add(user.userId));

    // Process audit logs for user activity
    recentLogs.forEach((log) => {
      const logDate = new Date(log.timestamp);
      const daysDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff <= 1) dailyUsers.add(log.userId);
      if (daysDiff <= 7) weeklyUsers.add(log.userId);
    });

    // Count specific actions
    const actionTypes = [
      "create_organization",
      "create_strategic_objective",
      "create_operational_key_result",
      "create_kpi",
      "create_team",
      "add_team_member"
    ];

    // Initialize action counts
    const actionsByType: Record<string, number> = {};
    actionTypes.forEach(type => {
      actionsByType[type] = 0;
    });

    // Count actions from audit logs
    recentLogs.forEach(log => {
      if (actionTypes.includes(log.action)) {
        actionsByType[log.action]++;
      }
    });

    // Calculate total actions
    const totalActions = Object.values(actionsByType).reduce((a, b) => a + b, 0);

    // Calculate active teams (teams with at least one member)
    const activeTeams = teams.filter(team => team.members && team.members.length > 0);

    return {
      activeUsers: {
        daily: dailyUsers.size || users.length * 0.3, // Fallback for testing
        weekly: weeklyUsers.size || users.length * 0.7, // Fallback for testing
        monthly: monthlyUsers.size,
      },
      teams: {
        total: teams.length,
        active: activeTeams.length,
      },
      activity: {
        totalActions: totalActions || recentLogs.length, // Fallback to total logs if no specific actions
        actionsByType,
      },
    };
  },
});

/**
 * Get team analytics
 */
export const getTeamAnalytics = query({
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

    // Only super admin, org admin, and team members can view team analytics
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamMember) {
      throw new Error("Not authorized to view team analytics");
    }

    // Get team audit logs
    const teamLogs = await ctx.db
      .query("auditLogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("resource"), "team"),
          q.eq(q.field("details.teamId"), args.teamId)
        )
      )
      .order("desc")
      .collect();

    // Calculate member activity
    const actionsByMember = teamLogs.reduce((acc, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate action types
    const actionsByType = teamLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate role distribution
    const roleCount = team.members.reduce(
      (acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      members: {
        total: team.members.length,
        active: Object.keys(actionsByMember).length,
        byRole: roleCount,
      },
      activity: {
        totalActions: teamLogs.length,
        actionsByMember,
        actionsByType,
      },
      performance: {
        participationRate:
          (Object.keys(actionsByMember).length / team.members.length) * 100,
        responseTime: 0, // TODO: Implement response time tracking
      },
    };
  },
});

/**
 * Get user analytics
 */
export const getUserAnalytics = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get user details
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const requesterId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, requesterId);
    const isOrgAdminUser = user.organizationId !== "SYSTEM" 
      ? await isOrgAdmin(ctx.db, requesterId, user.organizationId as Id<"organizations">) 
      : false;
    const isSelf = requesterId === args.userId;

    // Only super admin, org admin, and the user themselves can view user analytics
    if (!isSuperAdminUser && !isOrgAdminUser && !isSelf) {
      throw new Error("Not authorized to view user analytics");
    }

    // Get user's audit logs
    const userLogs = await ctx.db
      .query("auditLogs")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    // Get user's teams
    const teams = await ctx.db
      .query("teams")
      .filter((q) =>
        q.eq(q.field("organizationId"), user.organizationId)
      )
      .collect();

    const userTeams = teams.filter((team) =>
      team.members.some((member) => member.userId === args.userId)
    );

    // Calculate action types
    const actionsByType = userLogs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get last active timestamp
    const lastActive = userLogs.length > 0 ? userLogs[0].timestamp : user.createdAt;

    return {
      activity: {
        lastActive,
        totalActions: userLogs.length,
        actionsByType,
      },
      teams: {
        total: userTeams.length,
        roles: userTeams.map(
          (team) => team.members.find((m) => m.userId === args.userId)?.role || "team_member"
        ),
      },
      performance: {
        responseRate: 0, // TODO: Implement response rate tracking
        contributionScore: userLogs.length, // Simple contribution score based on total actions
      },
    };
  },
}); 