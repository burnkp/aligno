import { Team } from "@/types/teams";

export type Permission = "view" | "edit" | "delete" | "manage";
export type Role = "admin" | "leader" | "member";

export const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 3,
  leader: 2,
  member: 1,
};

export function getUserRole(userId: string, team: { members: Array<{ userId: string; role: Role }> }): Role | null {
  const member = team.members.find(m => m.userId === userId);
  return member?.role || null;
}

export function hasPermission(userRole: Role | null, requiredPermission: Permission): boolean {
  if (!userRole) return false;

  // Admins have all permissions
  if (userRole === "admin") return true;

  // Leaders can do everything except manage
  if (userRole === "leader") {
    return requiredPermission !== "manage";
  }

  // Members can only view
  if (userRole === "member") {
    return requiredPermission === "view";
  }

  return false;
}

export function canInviteMembers(role: Role): boolean {
  return role === "admin";
}

export function canManageTeam(role: Role): boolean {
  return role === "admin";
}

export function isTeamAdmin(team: Team, userId: string): boolean {
  return getUserRole(userId, team) === "admin";
}

export function isTeamMember(team: Team, userId: string): boolean {
  return team.members.some((member: { userId: string }) => member.userId === userId);
} 