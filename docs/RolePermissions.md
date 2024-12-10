# Role-Based Access Control (RBAC) System

## Overview
The RBAC system in Aligno provides granular control over user permissions and access levels. This document outlines the implementation details of the role-based access control system.

## Super Admin Configuration

### Email Configuration
- Super admin email is hardcoded as `kushtrim@promnestria.biz`
- This is defined in `convex/users.ts` as `SUPER_ADMIN_EMAIL`
- The same constant is used in middleware for route protection

### Automatic Creation
- When the super admin signs in for the first time:
  1. Clerk authenticates the user
  2. The `getUser` query checks if the user exists
  3. If not, and the email matches `SUPER_ADMIN_EMAIL`, a new super admin user is created
  4. User is automatically assigned the "super_admin" role
  5. Organization is set to "SYSTEM"

### Authentication Flow
1. User signs in through Clerk
2. Middleware checks email against `SUPER_ADMIN_EMAIL`
3. If matched:
   - Redirects to `/admin/dashboard` if on auth routes
   - Allows access to `/admin/*` routes
   - Redirects to admin dashboard from other routes
4. If not matched:
   - Prevents access to `/admin/*` routes
   - Redirects to appropriate dashboard based on role

### Environment Configuration
```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## User Roles

### Super Admin
- **Email**: kushtrim@promnestria.biz
- **Access Level**: System-wide access
- **Special Handling**: 
  - Automatically recognized and created upon first authentication
  - Direct access to `/admin/dashboard`
  - Cannot be demoted or removed
  - Organization ID: "SYSTEM"

### Organization Admin
- **Access Level**: Organization-wide access
- **Dashboard**: `/organizations/[organizationId]`
- **Permissions**: Manage organization settings, teams, and members

### Team Leader
- **Access Level**: Team-wide access
- **Dashboard**: `/teams`
- **Permissions**: Manage team settings and members

### Team Member
- **Access Level**: Limited team access
- **Dashboard**: `/teams`
- **Permissions**: View and participate in team activities

## Implementation Details

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
```

### Route Protection
- Middleware checks user role and email
- Prevents unauthorized access to admin routes
- Redirects users to appropriate dashboards

### Access Control
- Route-level protection through middleware
- Component-level protection through role checks
- API-level protection through Convex mutations and queries

## Security Considerations
- Email-based super admin verification
- Protected admin routes
- Role-based API access control
- Secure session management through Clerk

## Best Practices
1. Always verify user role before allowing access to protected routes
2. Use middleware for consistent route protection
3. Implement proper error handling for authentication failures
4. Maintain audit logs for security-relevant actions