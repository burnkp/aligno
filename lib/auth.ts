// Role-based access control utility functions
export type Role = "admin" | "leader" | "member";

export interface AccessControl {
  canCreateTeam: boolean;
  canInviteMembers: boolean;
  canEditKPIs: boolean;
  canCreateObjectives: boolean;
  canCreateOKRs: boolean;
  canUpdateProgress: boolean;
}

export const getRolePermissions = (role: Role): AccessControl => {
  switch (role) {
    case "admin":
      return {
        canCreateTeam: true,
        canInviteMembers: true,
        canEditKPIs: true,
        canCreateObjectives: true,
        canCreateOKRs: true,
        canUpdateProgress: true,
      };
    case "leader":
      return {
        canCreateTeam: false,
        canInviteMembers: true,
        canEditKPIs: true,
        canCreateObjectives: true,
        canCreateOKRs: true,
        canUpdateProgress: true,
      };
    case "member":
      return {
        canCreateTeam: false,
        canInviteMembers: false,
        canEditKPIs: false,
        canCreateObjectives: false,
        canCreateOKRs: false,
        canUpdateProgress: true,
      };
    default:
      return {
        canCreateTeam: false,
        canInviteMembers: false,
        canEditKPIs: false,
        canCreateObjectives: false,
        canCreateOKRs: false,
        canUpdateProgress: false,
      };
  }
}; 