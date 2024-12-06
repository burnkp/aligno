# Access Control and Role-Based Permissions

## Overview
This document details the implementation of access control and role-based permissions in the application, ensuring users can only access teams and features they are authorized to use.

## Access Control Implementation

### 1. Team Visibility
- Users can only see:
  - Teams they are members of
  - Teams they have pending invitations to
- Implemented through filtered database queries
- Proper authentication checks at both client and server

### 2. Role Hierarchy
```typescript
type Role = "admin" | "leader" | "member";

const ROLE_HIERARCHY = {
  admin: 3,
  leader: 2,
  member: 1,
} as const;

const ROLE_PERMISSIONS = {
  admin: ["manage_team", "invite_members", "manage_okrs", "manage_members", "view_analytics"],
  leader: ["invite_members", "manage_okrs", "view_analytics"],
  member: ["view_okrs", "update_assigned_okrs"],
} as const;
```

### 3. Permission System
- Fine-grained permissions based on roles
- Hierarchical permission inheritance
- Action-based permission checks

## Implementation Details

### 1. Database Schema Updates
```typescript
// teams.ts schema
teams: defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.string(),
  members: v.array(
    v.object({
      userId: v.string(),
      email: v.string(),
      name: v.string(),
      role: v.union(v.literal("admin"), v.literal("leader"), v.literal("member")),
      joinedAt: v.optional(v.string())
    })
  ),
  // New fields for access control
  visibility: v.union(v.literal("private"), v.literal("public")),
  allowedDomains: v.optional(v.array(v.string())),
})
```

### 2. Access Control Functions
```typescript
// utils/permissions.ts
export const hasPermission = (userRole: Role, requiredPermission: Permission): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole];
  return userPermissions.includes(requiredPermission);
};

export const canManageTeam = (userRole: Role): boolean => {
  return hasPermission(userRole, "manage_team");
};

export const canInviteMembers = (userRole: Role): boolean => {
  return hasPermission(userRole, "invite_members");
};
```

### 3. Server-Side Implementation
```typescript
// convex/teams.ts
export const listAccessibleTeams = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get teams where user is a member
    const memberTeams = await ctx.db
      .query("teams")
      .filter(q => 
        q.eq(q.field("members"), identity.subject)
      )
      .collect();

    // Get teams with pending invitations
    const pendingInvitations = await ctx.db
      .query("invitations")
      .withIndex("by_email", q => 
        q.eq("email", identity.email)
      )
      .filter(q => 
        q.eq(q.field("status"), "pending")
      )
      .collect();

    const invitedTeamIds = pendingInvitations.map(inv => inv.teamId);
    const invitedTeams = await Promise.all(
      invitedTeamIds.map(id => ctx.db.get(id))
    );

    return {
      memberTeams,
      invitedTeams: invitedTeams.filter(Boolean)
    };
  },
});
```

### 4. Client-Side Implementation
```typescript
// components/teams/team-card.tsx
export const TeamCard = ({ team }: { team: Team }) => {
  const { user } = useUser();
  const userRole = getUserRole(team, user?.id);

  return (
    <Card>
      <CardHeader>
        <h3>{team.name}</h3>
      </CardHeader>
      <CardContent>
        {canInviteMembers(userRole) && (
          <Button onClick={handleInvite}>
            Invite Members
          </Button>
        )}
        {canManageTeam(userRole) && (
          <Button onClick={handleTeamSettings}>
            Manage Team
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
```

### 5. Role-Based UI Components
```typescript
// components/permissions/require-permission.tsx
export const RequirePermission = ({ 
  permission, 
  children 
}: { 
  permission: Permission;
  children: React.ReactNode;
}) => {
  const { team, userRole } = useTeamContext();
  
  if (!hasPermission(userRole, permission)) {
    return null;
  }

  return <>{children}</>;
};
```

## Security Considerations

### 1. Authentication Checks
- Every database query includes authentication verification
- Token validation on all protected routes
- Session management through Clerk

### 2. Authorization Layers
- Server-side permission checks
- Client-side UI restrictions
- API endpoint protection

### 3. Data Access Control
- Row-level security in database queries
- Field-level access control
- Audit logging for sensitive operations

## Testing Strategy

### 1. Unit Tests
```typescript
describe("Permission System", () => {
  test("Admin has all permissions", () => {
    expect(hasPermission("admin", "manage_team")).toBe(true);
    expect(hasPermission("admin", "invite_members")).toBe(true);
  });

  test("Member has limited permissions", () => {
    expect(hasPermission("member", "manage_team")).toBe(false);
    expect(hasPermission("member", "view_okrs")).toBe(true);
  });
});
```

### 2. Integration Tests
- Test team visibility filters
- Verify role-based access
- Check permission inheritance

### 3. E2E Tests
- Complete user journeys
- Role switching scenarios
- Invitation and acceptance flows

## Monitoring and Debugging

### 1. Access Logs
- Track permission checks
- Monitor access patterns
- Identify potential security issues

### 2. Error Handling
- Clear error messages for permission denied
- Proper error reporting
- User feedback for unauthorized actions

### 3. Performance Monitoring
- Query optimization for access control
- Cache invalidation strategies
- Response time tracking

## Best Practices

1. **Principle of Least Privilege**
   - Grant minimum required permissions
   - Regular permission audits
   - Time-bound elevated access

2. **Separation of Concerns**
   - Decoupled permission logic
   - Centralized access control
   - Consistent enforcement

3. **Audit Trail**
   - Log all permission changes
   - Track sensitive operations
   - Maintain compliance records

## Related Documentation
- InvitationAndAuthenticationFlow.md - Authentication flow
- NewUserToUserProfilePageFlow.md - User onboarding
- email-invite-feature-FINAL.md - Invitation system 