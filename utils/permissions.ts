import { Team } from "@/types/teams";
import { Id } from "@/convex/_generated/dataModel";

export type Permission = 
  | "view_team"
  | "manage_team"
  | "invite_members"
  | "remove_members"
  | "create_objectives"
  | "manage_okrs"
  | "manage_kpis"
  | "view_analytics"
  | "create_team"
  | "manage_organization"
  | "view_organization"
  | "manage_all";

export type Role = "super_admin" | "org_admin" | "team_leader" | "team_member";

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 4,
  org_admin: 3,
  team_leader: 2,
  team_member: 1,
};

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ["manage_all"],
  org_admin: [
    "create_team",
    "manage_organization",
    "view_organization",
    "manage_team",
    "invite_members",
    "remove_members",
    "create_objectives",
    "manage_okrs",
    "manage_kpis",
    "view_analytics"
  ],
  team_leader: [
    "manage_team",
    "invite_members",
    "remove_members",
    "create_objectives",
    "manage_okrs",
    "manage_kpis",
    "view_analytics"
  ],
  team_member: [
    "view_team",
    "view_analytics"
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  if (role === "super_admin") return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canManageTeam(role: Role): boolean {
  return hasPermission(role, "manage_team");
}

export function canInviteMembers(role: Role): boolean {
  return hasPermission(role, "invite_members");
}

export function canRemoveMembers(role: Role): boolean {
  return hasPermission(role, "remove_members");
}

export function canCreateObjectives(role: Role): boolean {
  return hasPermission(role, "create_objectives");
}

export function canManageOKRs(role: Role): boolean {
  return hasPermission(role, "manage_okrs");
}

export function canManageKPIs(role: Role): boolean {
  return hasPermission(role, "manage_kpis");
}

export function canViewAnalytics(role: Role): boolean {
  return hasPermission(role, "view_analytics");
}

export function canCreateTeam(role: Role): boolean {
  return hasPermission(role, "create_team");
}

export function canManageOrganization(role: Role): boolean {
  return hasPermission(role, "manage_organization");
}

export function isTeamLeaderOrHigher(role: Role): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.team_leader;
}

export function getUserRole(userId: string, team: Pick<Team, "members">): Role | null {
  const member = team.members.find(m => m.userId === userId);
  return member?.role || null;
}

export function isTeamMember(team: Pick<Team, "members">, userId: string): boolean {
  return team.members.some(member => member.userId === userId);
}

export function getEffectivePermissions(role: Role): Permission[] {
  if (role === "super_admin") {
    return ["manage_all"];
  }
  return ROLE_PERMISSIONS[role] || [];
}

export function canAccessTeamDashboard(role: Role, teamId: Id<"teams">, userTeams: Pick<Team, "_id" | "members">[]): boolean {
  if (role === "super_admin") return true;
  return userTeams.some(team => team._id === teamId && isTeamMember(team, teamId.toString()));
}

export function getDashboardRedirect(role: Role, organizationId?: Id<"organizations">): string {
  switch (role) {
    case "super_admin":
      return "/admin/dashboard";
    case "org_admin":
      return `/organizations/${organizationId}/dashboard`;
    case "team_leader":
    case "team_member":
      return "/teams/dashboard";
    default:
      return "/dashboard";
  }
}

// Helper function to check if user can manage specific team
export function canManageSpecificTeam(
  role: Role,
  userId: string,
  team: Pick<Team, "members" | "organizationId" | "leaderId">,
  organizationId?: Id<"organizations">
): boolean {
  if (role === "super_admin") return true;
  if (role === "org_admin" && team.organizationId && team.organizationId === organizationId) return true;
  if (role === "team_leader") {
    const member = team.members.find(m => m.userId === userId);
    return member?.role === "team_leader";
  }
  return false;
} 