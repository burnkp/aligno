# Backend Structure Documentation

## 1. Database Schema

### 1.1 Core Tables
- **organizations**: Customer/organization data
- **users**: User data with role and organization mapping
- **teams**: Team data with organization mapping
- **strategicObjectives**: High-level objectives
- **operationalKeyResults**: OKRs linked to strategic objectives
- **kpis**: Key performance indicators
- **invitations**: Team invitations
- **auditLogs**: System event tracking
- **emailLogs**: Email delivery tracking
- **milestones**: Strategic objective milestones
- **dependencies**: Relationships between objectives

### 1.2 Schema Details

#### Organizations Table
```typescript
{
  name: string,
  contactPerson: {
    name: string,
    email: string,
    phone?: string,
  },
  status: "active" | "inactive",
  subscription: {
    plan: string,
    status: "active" | "inactive" | "trial" | "expired" | "pending",
    startDate: string,
    endDate?: string,
  },
  createdAt: string,
  updatedAt: string,
}
```

#### Users Table
```typescript
{
  userId: string,
  email: string,
  name: string,
  role: "super_admin" | "org_admin" | "team_leader" | "team_member",
  organizationId: "SYSTEM" | Id<"organizations">,
  createdAt: string,
  updatedAt: string,
}
```

## 2. Authentication & Authorization

### 2.1 Authentication Flow
- Uses Clerk for user authentication
- Clerk webhook integration for user data sync
- JWT token validation with Clerk domain
- Role-based access control (RBAC)

### 2.2 User Roles
1. **Super Admin**
   - Full system access
   - Can manage all organizations
   - Can view all analytics
   - System configuration access

2. **Organization Admin**
   - Organization-level access
   - Team management
   - Organization settings
   - Analytics access

3. **Team Leader**
   - Team-level access
   - Member management
   - KPI/OKR management
   - Team analytics

4. **Team Member**
   - Limited team access
   - View assigned KPIs
   - Update own metrics
   - View team analytics

## 3. API Structure

### 3.1 Core APIs

#### Organization Management
```typescript
// Queries
getAllOrganizations()
getOrganization(organizationId)
getOrganizationUsers(organizationId)

// Mutations
createOrganization(data)
updateOrganization(id, data)
deleteOrganization(id)
```

#### User Management
```typescript
// Queries
getUser(userId)
getAllUsers()

// Mutations
createUser(data)
updateUser(userId, updates)
ensureSuperAdmin(userId)
```

#### Team Management
```typescript
// Queries
getAllTeams()
getTeams()
getUserAccess(teamId)

// Mutations
createTeam(data)
updateTeam(id, data)
deleteTeam(id)
```

### 3.2 Permission System
```typescript
type PermissionAction = "create" | "read" | "update" | "delete" | "manage";
type Resource = "organization" | "team" | "user" | "task" | "analytics";

// Permission checks
isSuperAdmin(db, userId)
isUserInOrganization(db, userId, organizationId)
checkPermission(db, { userId, action, resource, organizationId })
```

## 4. Real-time Features

### 4.1 Convex Implementation
- Real-time data synchronization
- Automatic conflict resolution
- Optimistic updates
- Offline support
- WebSocket connections

### 4.2 Real-time Events
- Team updates
- KPI changes
- OKR progress
- Member activities
- System notifications

## 5. Email System

### 5.1 Resend Integration
```typescript
// Email service configuration
const resend = new Resend(apiKey);

// Email types
- Team invitations
- Notifications
- Reports
- System alerts
```

### 5.2 Email Tracking
```typescript
// Email logs schema
{
  email: string,
  teamId: string,
  status: string,
  error?: string,
  details?: string,
  timestamp: string,
  environment: string,
}
```

## 6. Audit System

### 6.1 Audit Logs
```typescript
// Audit schema
{
  userId: string,
  action: string,
  resource: string,
  details: any,
  organizationId?: Id<"organizations">,
  timestamp: string,
}
```

### 6.2 Tracked Actions
- User activities
- System changes
- Permission changes
- Critical operations
- Security events

## 7. Data Migration System

### 7.1 Migration Functions
```typescript
// Available migrations
migrateKPIs()
migrateTeamMembers()
fixKPIsTable()
fixInvitationsTable()
fixOperationalKeyResultsTable()
fixStrategicObjectivesTable()
fixTeamsTable()
createDefaultOrgAndFixTeams()
```

### 7.2 Migration Patterns
- Schema updates
- Data normalization
- Field additions
- Status updates
- Relationship fixes

## 8. Error Handling

### 8.1 Error Types
- Authentication errors
- Permission errors
- Validation errors
- System errors
- Network errors

### 8.2 Error Handling Pattern
```typescript
try {
  // Operation
} catch (error) {
  logger.error("Operation failed:", error);
  throw new Error("User-friendly error message");
}
```

## 9. Testing

### 9.1 Test Types
- Unit tests
- Integration tests
- API tests
- Permission tests
- Migration tests

### 9.2 Test Utilities
```typescript
// Test endpoints
get() // Connection test
testResend() // Email system test
```

## 10. Performance Optimization

### 10.1 Database Indexes
```typescript
// Example indexes
.index("by_status", ["status"])
.index("by_organization", ["organizationId"])
.index("by_email", ["email"])
.index("by_team", ["teamId"])
```

### 10.2 Query Optimization
- Efficient indexes
- Selective queries
- Batch operations
- Caching strategies
- Real-time optimizations
``` 