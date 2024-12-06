import { Team } from "@/types/teams";

export type Role = "admin" | "leader" | "member";
export type Permission = 
  | "manage_team"
  | "invite_members"
  | "manage_okrs"
  | "manage_members"
  | "view_analytics"
  | "view_okrs"
  | "update_assigned_okrs";

export const ROLE_HIERARCHY = {
  admin: 3,
  leader: 2,
  member: 1,
} as const;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ["manage_team", "invite_members", "manage_okrs", "manage_members", "view_analytics", "view_okrs", "update_assigned_okrs"],
  leader: ["invite_members", "manage_okrs", "view_analytics", "view_okrs", "update_assigned_okrs"],
  member: ["view_okrs", "update_assigned_okrs"],
} as const;

/**
 * Check if a user has a specific permission based on their role
 */
export const hasPermission = (userRole: Role, requiredPermission: Permission): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole];
  return userPermissions.includes(requiredPermission);
};

/**
 * Get a user's role in a team
 */
export const getUserRole = (team: Team, userId: string): Role | null => {
  const member = team.members.find(m => m.userId === userId);
  return member?.role || null;
};

/**
 * Check if a user can manage the team
 */
export const canManageTeam = (userRole: Role): boolean => {
  return hasPermission(userRole, "manage_team");
};

/**
 * Check if a user can invite members
 */
export const canInviteMembers = (userRole: Role): boolean => {
  return hasPermission(userRole, "invite_members");
};

/**
 * Check if a user can manage OKRs
 */
export const canManageOKRs = (userRole: Role): boolean => {
  return hasPermission(userRole, "manage_okrs");
};

/**
 * Check if a user can view analytics
 */
export const canViewAnalytics = (userRole: Role): boolean => {
  return hasPermission(userRole, "view_analytics");
};

/**
 * Check if a user has a role equal to or higher than the required role
 */
export const hasMinimumRole = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Check if a user is a member of a team
 */
export const isTeamMember = (team: Team, userId: string): boolean => {
  return team.members.some(m => m.userId === userId);
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role: Role): Permission[] => {
  return ROLE_PERMISSIONS[role];
}; 