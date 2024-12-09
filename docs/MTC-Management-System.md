# Multi-Tenant Customer Management System (MTCMS)

## Overview

The Multi-Tenant Customer Management System (MTCMS) introduces a fully isolated, multi-tenant architecture to Aligno. It allows a single Super Administrator to manage all organizations (customers) and ensures that each organization's data is securely partitioned. Additionally, it implements role-based access control (RBAC) so that org_admin, team_leader, and team_member roles have strictly defined permissions and visibility scopes.

## Key Objectives

1. **Super Administrator Control**: The Super Admin has full visibility and control across all organizations.
2. **Organization (Customer) Onboarding**: Ability to manually create and manage organizations within Aligno, including setting their org_admin, and tracking their subscription and usage metrics.
3. **Role-Based Access Control**: Clear role definitions and enforced permissions ensuring that each user only sees and manipulates data belonging to their organization (except the Super Admin).
4. **Data Isolation and Security**: All queries and data mutations respect organization boundaries, ensuring no cross-tenant data leakage.
5. **Scalability and Future Integrations**: The schema and workflows are designed with an eye toward future integration of automated billing, advanced analytics, and complex role expansions.

## Implementation Phases

### Phase 1: Database Schema Updates

#### Goal
Introduce new entities and fields in Convex to support multi-tenancy and a clear organization-to-user relationship.

#### Schema Definitions

##### Organizations (Customers)
```typescript
{
  "id": Id<"organizations">,
  "name": string,
  "contactPerson": {
    "name": string,
    "email": string,
    "phone"?: string
  },
  "status": "active" | "inactive",
  "subscription": {
    "plan": string,
    "startDate": string,
    "endDate"?: string
  },
  "createdAt": string,
  "updatedAt": string
}
```

##### Users (Extended Schema)
```typescript
{
  "userId": string, // Clerk User ID
  "email": string,
  "name": string,
  "role": "super_admin" | "org_admin" | "team_leader" | "team_member",
  "organizationId": Id<"organizations">,
  "createdAt": string,
  "updatedAt": string
}
```

##### Teams (Updated Schema)
```typescript
{
  "name": string,
  "description"?: string,
  "organizationId"?: Id<"organizations">, // Optional for backward compatibility
  "leaderId"?: string, // Clerk User ID of team leader
  "createdBy"?: string, // For backward compatibility
  "members": Array<{
    "userId": string,
    "email"?: string, // For backward compatibility
    "name"?: string, // For backward compatibility
    "role": "admin" | "leader" | "member",
    "joinedAt"?: string
  }>,
  "createdAt"?: string,
  "updatedAt"?: string
}
```

##### Audit Logs
```typescript
{
  "organizationId"?: Id<"organizations">,
  "userId": string, // Clerk User ID
  "action": string,
  "resource": string,
  "details": any,
  "timestamp": string
}
```

#### Implementation Notes

1. **Authentication Updates**
   - All functions now use `ctx.auth.getUserIdentity()` for secure authentication
   - User identification is based on Clerk's `identity.subject`
   - Added proper authentication checks across all endpoints

2. **Backward Compatibility**
   - Team schema modified to support existing data structure
   - Added optional fields for smooth migration
   - Maintained support for legacy role types

3. **Security Enhancements**
   - Added comprehensive permission checking
   - Implemented audit logging for all critical actions
   - Enforced organization boundaries

### Phase 2: Super Admin Dashboard

#### Goal
Implement a protected route (/admin/dashboard) accessible only by the Super Admin.

#### Features
1. **Customer Management Interface**
   - Organization list with details
   - Search, sort, and filter capabilities
   - Organization metrics
   - New organization creation form

2. **Organization Details View**
   - Detailed organization information
   - Team and user management
   - Activity metrics

3. **Analytics Overview**
   - Cross-organization analytics
   - Usage metrics and trends

### Phase 3: Organization-Level Access Control and Onboarding Flow

#### Goal
Ensure organization data isolation and streamlined onboarding.

#### Key Components
1. **Authentication and Redirects**
   - Role-based routing
   - Organization context management

2. **Onboarding Workflow**
   - Organization creation process
   - Admin invitation flow
   - Initial setup guidance

3. **Data Filtering**
   - Organization-level data isolation
   - Permission-based access control

### Phase 4: Role-Based Views and Permissions

#### Goal
Implement role-specific interfaces and permissions.

#### Role Definitions
1. **super_admin**
   - Full system access
   - Organization management
   - Global analytics

2. **org_admin**
   - Organization-wide access
   - Team management
   - Organization analytics

3. **team_leader**
   - Team-level access
   - Member management
   - Team analytics

4. **team_member**
   - Personal dashboard
   - Assigned KPIs
   - Team overview

### Phase 5: Security & Access Control Implementation

#### Goal
Implement comprehensive security measures.

#### Components
1. **Middleware & Server-Side Checks**
   - Permission validation
   - Resource access control

2. **Data Validation**
   - Input sanitization
   - Access verification
   - Error handling

### Phase 6: Testing & Documentation

#### Goal
Ensure system reliability and maintainability.

#### Components
1. **Testing Strategy**
   - Unit testing
   - Integration testing
   - End-to-end testing

2. **Documentation**
   - Architecture documentation
   - API documentation
   - User guides

## Implementation Status

| Phase | Status | Notes |
|-------|--------|-------|
| 1     | Complete| Database schema implemented with backward compatibility |
| 2     | Pending | Super Admin Dashboard implementation next |
| 3     | Pending | - |
| 4     | Pending | - |
| 5     | Pending | - |
| 6     | Pending | - |

## Related Documentation
- [Organization Onboarding](./OrganizationOnboarding.md)
- [Role Permissions](./RolePermissions.md)
- [Team-Level Data Isolation](./TeamDataIsolation.md) 