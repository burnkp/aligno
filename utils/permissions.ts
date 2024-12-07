import { Team } from "@/types/teams";

export type UserRole = "admin" | "member";

export function getUserRole(team: Team, userId: string): UserRole | null {
  const member = team.members.find((m: { userId: string; role: UserRole }) => m.userId === userId);
  return member?.role || null;
}

export function canInviteMembers(role: UserRole): boolean {
  return role === "admin";
}

export function canManageTeam(role: UserRole): boolean {
  return role === "admin";
}

export function isTeamAdmin(team: Team, userId: string): boolean {
  return getUserRole(team, userId) === "admin";
}

export function isTeamMember(team: Team, userId: string): boolean {
  return team.members.some((member: { userId: string }) => member.userId === userId);
} 