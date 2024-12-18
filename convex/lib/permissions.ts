import { v } from "convex/values";
import { DatabaseReader, DatabaseWriter, QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export type UserRole = "super_admin" | "org_admin" | "team_leader" | "team_member";
export type PermissionAction = "create" | "read" | "update" | "delete" | "manage";
export type Resource = "organization" | "team" | "user" | "task" | "analytics";

/**
 * Check if a user has the super_admin role
 */
export async function isSuperAdmin(
  db: DatabaseReader,
  userId: string
): Promise<boolean> {
  const user = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();
  return user?.role === "super_admin";
}

/**
 * Check if a user belongs to a specific organization
 */
export async function isUserInOrganization(
  db: DatabaseReader,
  userId: string,
  organizationId: Id<"organizations">
): Promise<boolean> {
  const user = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();
  return user?.organizationId === organizationId;
}

/**
 * Check if a user has permission to perform an action on a resource
 */
export async function checkPermission(
  db: DatabaseReader,
  args: {
    userId: string;
    action: PermissionAction;
    resource: Resource;
    organizationId?: Id<"organizations">;
    teamId?: Id<"teams">;
  }
): Promise<boolean> {
  const { userId, action, resource, organizationId, teamId } = args;

  // Get user details
  const user = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();

  if (!user) return false;

  // Super admin has all permissions
  if (user.role === "super_admin") return true;

  // Check organization membership if organizationId is provided
  if (organizationId && user.organizationId !== organizationId) return false;

  // Check team membership if teamId is provided
  if (teamId) {
    const team = await db.get(teamId);
    if (!team || team.organizationId !== user.organizationId) return false;

    const isMember = team.members.some((member) => member.userId === userId);
    if (!isMember) return false;
  }

  // Role-based permission checks
  switch (user.role) {
    case "org_admin":
      // Org admin can do anything within their organization
      return true;

    case "team_leader":
      // Team leaders can manage their team and view organization data
      if (resource === "organization") return action === "read";
      if (resource === "team") {
        if (!teamId) return false;
        const team = await db.get(teamId);
        return team?.leaderId === userId;
      }
      return ["read", "update"].includes(action);

    case "team_member":
      // Team members can only read most resources and update their own data
      if (action === "read") return true;
      if (action === "update" && resource === "user") return true;
      return false;

    default:
      return false;
  }
}

/**
 * Log an audit event
 */
export async function logAuditEvent(
  db: DatabaseWriter,
  args: {
    userId: string;
    action: string;
    resource: string;
    details: any;
    organizationId?: Id<"organizations">;
  }
) {
  const { userId, action, resource, details, organizationId } = args;

  await db.insert("auditLogs", {
    userId,
    action,
    resource,
    details,
    organizationId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Check if a user is an organization admin
 */
export async function isOrgAdmin(
  db: DatabaseReader,
  userId: string,
  organizationId: Id<"organizations">
): Promise<boolean> {
  const user = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();

  return user?.role === "org_admin" && user?.organizationId === organizationId;
}

/**
 * Get all team IDs that a user has access to
 * @param ctx - The Convex query context
 * @param userId - The user's ID (from Clerk)
 * @returns Array of team IDs the user has access to
 */
export async function getAllowedTeamIds(
  ctx: QueryCtx,
  userId: string
): Promise<string[]> {
  // Get user's record to check role
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();

  if (!user) {
    return [];
  }

  // Super admins can access all teams
  if (user.role === "super_admin") {
    const allTeams = await ctx.db.query("teams").collect();
    return allTeams.map((team) => team._id);
  }

  // Get all teams first
  const allTeams = await ctx.db.query("teams").collect();

  // Filter teams where user is a member
  const teams = allTeams.filter(team => 
    team.members.some(member => member.userId === userId)
  );

  // If user is org_admin, also get all teams in their organization
  if (user.role === "org_admin" && user.organizationId !== "SYSTEM") {
    // Type guard to ensure organizationId is a valid Id<"organizations">
    const isValidOrgId = (id: string | Id<"organizations">): id is Id<"organizations"> => 
      id !== "SYSTEM";

    if (isValidOrgId(user.organizationId)) {
      // Store the valid organization ID to maintain type safety
      const orgId = user.organizationId;
      const orgTeams = await ctx.db
        .query("teams")
        .withIndex("by_organization", (q) => 
          q.eq("organizationId", orgId)
        )
        .collect();
      
      // Create a Set from team IDs and convert back to array
      const teamIds = teams.map((team) => team._id);
      const orgTeamIds = orgTeams.map((team) => team._id);
      const uniqueTeamIds = Array.from(new Set([...teamIds, ...orgTeamIds]));
      
      return uniqueTeamIds;
    }
  }

  return teams.map((team) => team._id);
} 