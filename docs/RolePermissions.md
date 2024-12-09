# Role-Based Access Control (RBAC) System

## Overview
The RBAC system in Aligno provides granular control over user permissions and access levels. This document outlines the implementation details of the role-based access control system.

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

## Authentication Flow

1. **Initial Authentication**
   - User signs in through Clerk
   - Email is verified against role definitions
   - Super admin is automatically recognized and created if not exists

2. **Route Protection**
   - Public routes (`/`, `/get-started`) are accessible to all
   - Admin routes (`/admin/*`) are restricted to super admin
   - Organization and team routes are protected based on user role

3. **Dashboard Routing**
   - Super Admin → `/admin/dashboard`
   - Org Admin → `/organizations/[organizationId]`
   - Team Leader/Member → `/teams`

## Implementation Details

### Middleware Protection
- Implements route protection and role-based redirects
- Handles super admin authentication
- Manages public route access
- Provides role-based routing logic

### User Creation
- Automatic super admin creation on first login
- Role assignment based on email and organization context
- Secure storage of user data in Convex database

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