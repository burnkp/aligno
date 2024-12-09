import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { isSuperAdmin, isOrgAdmin } from "./lib/permissions";

/**
 * Get audit logs for a specific team
 */
export const getTeamLogs = query({
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

    // Only super admin, org admin, and team members can view logs
    if (!isSuperAdminUser && !isOrgAdminUser && !isTeamMember) {
      throw new Error("Not authorized to view team logs");
    }

    // Get all logs related to this team
    const logs = await ctx.db
      .query("auditLogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("resource"), "team"),
          q.eq(q.field("details.teamId"), args.teamId)
        )
      )
      .order("desc")
      .collect();

    return logs;
  },
});

/**
 * Get audit logs for an organization
 */
export const getOrganizationLogs = query({
  args: { organizationId: v.id("organizations") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const isSuperAdminUser = await isSuperAdmin(ctx.db, userId);
    const isOrgAdminUser = await isOrgAdmin(ctx.db, userId, args.organizationId);

    // Only super admin and org admin can view organization logs
    if (!isSuperAdminUser && !isOrgAdminUser) {
      throw new Error("Not authorized to view organization logs");
    }

    // Get all logs for this organization
    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .collect();

    return logs;
  },
}); 