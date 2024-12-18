"use client";

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { Team } from "@/types/teams";
import { Permission, Role, getUserRole, hasPermission, ROLE_HIERARCHY } from "@/utils/permissions";

interface RequirePermissionProps {
  team: Team;
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

interface RequireRoleProps {
  team: Team;
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on user permissions
 */
export const RequirePermission = ({
  team,
  permission,
  children,
  fallback = null,
}: RequirePermissionProps) => {
  const { user } = useUser();
  
  if (!user) {
    return fallback;
  }

  const userRole = getUserRole(user.id, team);
  
  if (!userRole || !hasPermission(userRole, permission)) {
    return fallback;
  }

  return <>{children}</>;
};

/**
 * A component that conditionally renders its children based on user role
 */
export const RequireRole = ({
  team,
  role,
  children,
  fallback = null,
}: RequireRoleProps) => {
  const { user } = useUser();
  
  if (!user) {
    return fallback;
  }

  const userRole = getUserRole(user.id, team);
  
  if (!userRole || ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[role]) {
    return fallback;
  }

  return <>{children}</>;
}; 