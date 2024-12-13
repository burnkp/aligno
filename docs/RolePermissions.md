# Role-Based Access Control (RBAC) System

## Overview
The RBAC system in Aligno provides granular control over user permissions and access levels. This document outlines the implementation details of the role-based access control system.

## Super Admin Configuration

### Email Configuration
- Super admin email is defined in `config/auth.ts` as part of `SUPER_ADMINS` array
- Supports multiple super admin emails if needed
- All email addresses are stored in lowercase for consistency
- Current super admin: kushtrim@promnestria.biz

### Database Schema
```typescript
users: defineTable({
  userId: v.string(),
  email: v.string(),
  name: v.string(),
  role: v.union(
    v.literal("super_admin"),
    v.literal("org_admin"),
    v.literal("team_leader"),
    v.literal("team_member")
  ),
  organizationId: v.union(v.literal("SYSTEM"), v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
})
  .index("by_clerk_id", ["userId"])
  .index("by_email", ["email"])
```

### Authentication Flow
1. User signs in through Clerk
2. Middleware checks authentication state
3. For protected routes:
   - Verifies user authentication
   - Fetches complete user data from Clerk
   - Checks email against super admin list
   - Allows/denies access based on role
4. For public routes:
   - Allows access without verification
5. For super admin:
   - Verifies email against SUPER_ADMINS list
   - Redirects `/dashboard` to `/admin/dashboard`
   - Protects all `/admin/*` routes

### Route Access Control
- Public routes: Accessible without authentication
  - Landing page: `/`
  - Get Started: `/get-started`
  - Authentication: `/sign-in`, `/sign-up`
- Protected routes: Require authentication
  - Admin routes: `/admin/*` (super admin only)
  - Organization routes: `/organizations/*`
  - Team routes: `/teams/*`
- Redirection rules:
  - Unauthenticated users → `/sign-in`
  - Unauthorized admin access → `/`
  - Super admin at `/dashboard` → `/admin/dashboard`

### Middleware Implementation
```typescript
// Define routes
const publicRoutes = ["/", "/sign-in*", "/sign-up*"];
const authRoutes = ["/auth-callback"];

// Route checking
const isPublicRoute = publicRoutes.some(pattern => {
  if (pattern.endsWith("*")) {
    return url.pathname.startsWith(pattern.slice(0, -1));
  }
  return url.pathname === pattern;
});

// Permission checking
if (url.pathname.startsWith("/admin")) {
  if (!primaryEmail || !SUPER_ADMINS.includes(primaryEmail)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
```

## User Roles

### Super Admin
- **Access**: Full system access
- **Routes**: All routes including `/admin/*`
- **Special Privileges**: 
  - Can create organizations
  - Can manage all users
  - Can access analytics
  - Can configure system settings

### Organization Admin
- **Access**: Organization-wide access
- **Routes**: Organization-specific routes
- **Privileges**:
  - Manage organization settings
  - Create and manage teams
  - Manage organization members

### Team Leader
- **Access**: Team-level access
- **Routes**: Team-specific routes
- **Privileges**:
  - Manage team settings
  - Add/remove team members
  - View team analytics

### Team Member
- **Access**: Basic access
- **Routes**: Team member routes
- **Privileges**:
  - View team information
  - Participate in team activities
  - Update own profile

## Implementation Details

### Permission Checking
```typescript
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
```

### Access Control
- Route-level: Through Next.js middleware
- API-level: Through Convex queries/mutations
- Component-level: Through role-based rendering

### Audit Logging
```typescript
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

## Security Considerations
1. Email addresses are stored and compared in lowercase
2. All routes are protected by default
3. Permissions are checked at multiple levels
4. Actions are logged for audit purposes
5. User data is properly isolated

## Best Practices
1. Always use middleware for route protection
2. Implement role checks in all mutations/queries
3. Log security-relevant actions
4. Validate permissions before operations
5. Keep super admin list in config
6. Use proper error handling
7. Implement proper data isolation