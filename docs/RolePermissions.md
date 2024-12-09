# Role-Based Access Control (RBAC)

## Overview

This document defines the role-based access control system in Aligno, detailing the permissions and capabilities of each role within the system.

## Role Hierarchy

1. **Super Administrator** (super_admin)
2. **Organization Administrator** (org_admin)
3. **Team Leader** (team_leader)
4. **Team Member** (team_member)

## Permission Matrix

### Super Administrator (super_admin)

#### Access Scope
- Full system access
- Cross-organization visibility
- System-wide configuration

#### Permissions
- [x] Create/manage organizations
- [x] Assign org_admin roles
- [x] View all organization data
- [x] Access system analytics
- [x] Manage system configurations
- [x] View audit logs

### Organization Administrator (org_admin)

#### Access Scope
- Organization-wide access
- No cross-organization visibility
- Organization configuration

#### Permissions
- [x] Manage organization settings
- [x] Create/manage teams
- [x] Assign team_leader roles
- [x] View organization analytics
- [x] Manage organization members
- [ ] Access other organizations
- [ ] Modify system settings

### Team Leader (team_leader)

#### Access Scope
- Team-level access
- Limited organization visibility
- Team management

#### Permissions
- [x] Manage team settings
- [x] Invite team members
- [x] Assign tasks/KPIs
- [x] View team analytics
- [ ] Modify organization settings
- [ ] Access other teams' data
- [ ] Assign roles

### Team Member (team_member)

#### Access Scope
- Personal access
- Team visibility
- Task management

#### Permissions
- [x] View assigned tasks
- [x] Update task status
- [x] View team dashboard
- [x] Update personal profile
- [ ] Modify team settings
- [ ] Invite members
- [ ] View organization data

## Implementation Details

### Authentication

```typescript
// User authentication check
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error("Not authenticated");
}
const userId = identity.subject;
```

### Permission Checking

```typescript
// Permission check function
async function checkPermission(
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

  // Check organization membership
  if (organizationId && user.organizationId !== organizationId) return false;

  // Role-based permission checks
  switch (user.role) {
    case "org_admin":
      return true; // Full access within their organization
    case "team_leader":
      if (resource === "organization") return action === "read";
      if (resource === "team") {
        if (!teamId) return false;
        const team = await db.get(teamId);
        return team?.leaderId === userId;
      }
      return ["read", "update"].includes(action);
    case "team_member":
      if (action === "read") return true;
      if (action === "update" && resource === "user") return true;
      return false;
    default:
      return false;
  }
}
```

### Audit Logging

```typescript
// Audit logging implementation
async function logAuditEvent(
  db: DatabaseWriter,
  args: {
    userId: string;
    action: string;
    resource: string;
    details: any;
    organizationId?: Id<"organizations">;
  }
) {
  await db.insert("auditLogs", {
    userId,
    action,
    resource,
    details,
    organizationId,
    timestamp: new Date().toISOString(),
  });
}
```

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Role Definitions | Complete | Implemented with backward compatibility |
| Permission Checks | Complete | Using Clerk authentication |
| Access Control | Complete | Organization and team-level isolation |
| Testing | Pending | - |

## Security Considerations

### Authentication Flow
1. Get user identity from Clerk
2. Validate authentication status
3. Extract user ID from identity subject
4. Check user permissions based on role

### Data Access Controls
1. Organization-level isolation
2. Role-based access restrictions
3. Team-level permissions
4. Audit logging for all actions

### Error Handling
1. Authentication errors
2. Permission denied errors
3. Resource not found errors
4. Invalid action errors