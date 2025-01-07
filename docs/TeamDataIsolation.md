# Team Data Isolation

## Overview

This document outlines the implementation of data isolation between teams within organizations in Aligno. It details how we ensure that team data remains secure and accessible only to authorized users while maintaining efficient data access patterns.

## Data Isolation Principles

### 1. Organization-Level Isolation

#### Implementation
```typescript
// Organization context type
type OrganizationContext = {
  organizationId: Id<"organizations">;
  role: UserRole;
  permissions: Permission[];
};

// Data access with organization context
async function withOrganizationContext<T>(
  ctx: Context,
  organizationId: Id<"organizations">,
  action: (orgCtx: OrganizationContext) => Promise<T>
): Promise<T> {
  // Implementation details will be added during development
}
```

#### Security Measures
- Automatic organization ID injection
- Permission validation
- Cross-organization access prevention

### 2. Team-Level Isolation

#### Implementation
```typescript
// Team context type
type TeamContext = {
  teamId: Id<"teams">;
  organizationId: Id<"organizations">;
  role: "super_admin" | "org_admin" | "team_leader" | "team_member";
  permissions: Permission[];
};

// Data access with team context
async function withTeamContext<T>(
  ctx: Context,
  teamId: Id<"teams">,
  action: (teamCtx: TeamContext) => Promise<T>
): Promise<T> {
  // Implementation details will be added during development
}
```

#### Security Measures
- Team membership validation
- Role-based access control
- Data access logging

## Data Access Patterns

### 1. Query Filtering

```typescript
// Base query filter type
type QueryFilter = {
  organizationId?: Id<"organizations">;
  teamId?: Id<"teams">;
  userId?: string;
};

// Filtered query implementation
async function getFilteredQuery<T>(
  ctx: Context,
  table: string,
  filter: QueryFilter
): Promise<T[]> {
  // Implementation details will be added during development
}
```

### 2. Mutation Validation

```typescript
// Mutation context validation
async function validateMutationContext(
  ctx: Context,
  args: {
    organizationId: Id<"organizations">;
    teamId?: Id<"teams">;
    action: string;
  }
): Promise<boolean> {
  // Implementation details will be added during development
}
```

## Implementation Details

### 1. Database Schema Considerations

#### Team Table (Updated)
```typescript
interface Team {
  id: Id<"teams">;
  name: string;
  description?: string;
  organizationId?: Id<"organizations">; // Optional for backward compatibility
  leaderId?: string; // Clerk User ID of team leader
  createdBy?: string; // For backward compatibility
  members: Array<{
    userId: string;
    email?: string; // For backward compatibility
    name?: string; // For backward compatibility
    role: "super_admin" | "org_admin" | "team_leader" | "team_member";
    joinedAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}
```

#### Team Data Table
```typescript
interface TeamData {
  id: Id<"teamData">;
  teamId: Id<"teams">;
  organizationId: Id<"organizations">;
  type: "objective" | "kpi" | "task";
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Access Control Implementation

#### Authentication Check
```typescript
// User authentication check
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error("Not authenticated");
}
const userId = identity.subject;
```

#### Permission Checking
```typescript
// Team access check
async function checkTeamAccess(
  db: DatabaseReader,
  teamId: Id<"teams">,
  userId: string,
  requiredPermission: Permission
): Promise<boolean> {
  const team = await db.get(teamId);
  if (!team) return false;

  const user = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();

  if (!user) return false;

  // Super admin has all permissions
  if (user.role === "super_admin") return true;

  // Check organization membership
  if (team.organizationId && user.organizationId !== team.organizationId) {
    return false;
  }

  // Check team membership and role
  const member = team.members.find((m) => m.userId === userId);
  if (!member) return false;

  switch (member.role) {
    case "super_admin":
    case "org_admin":
    case "team_leader":
      return true;
    case "team_member":
      return requiredPermission === "read";
    default:
      return false;
  }
}
```

### 3. Data Access Patterns

#### Query Filtering
```typescript
// Filtered team query
async function getTeamsForUser(
  db: DatabaseReader,
  userId: string,
  organizationId: Id<"organizations">
): Promise<Team[]> {
  const user = await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("userId", userId))
    .first();

  if (!user) return [];

  // Super admin can see all teams in the organization
  if (user.role === "super_admin") {
    return await db
      .query("teams")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
  }

  // Org admin can see all teams in their organization
  if (user.role === "org_admin" && user.organizationId === organizationId) {
    return await db
      .query("teams")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();
  }

  // Team leaders and members can only see their teams
  return await db
    .query("teams")
    .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
    .filter((q) =>
      q.eq(
        q.field("members").contains((member) => member.userId === userId),
        true
      )
    )
    .collect();
}
```

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Schema Design | Complete | Updated for backward compatibility |
| Access Control | Complete | Implemented with Clerk auth |
| Query Filtering | Complete | Role-based filtering implemented |
| Security Measures | Complete | Organization and team isolation |
| Testing | Pending | - |

## Security Measures

### 1. Authentication
- Clerk-based authentication
- Identity verification
- Session management

### 2. Authorization
- Role-based access control
- Team membership validation
- Organization boundary enforcement

### 3. Data Protection
- Query-level filtering
- Mutation validation
- Audit logging

## Performance Considerations

### 1. Query Optimization
- Indexed fields for faster lookups
- Efficient filtering patterns
- Minimal data fetching

### 2. Caching Strategy
- Permission results caching
- User role caching
- Team membership caching