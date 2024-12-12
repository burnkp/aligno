# Organization Creation Process

## Overview
The organization creation process in Aligno is a multi-step wizard that handles:
1. Organization details and subscription plan
2. Admin user setup
3. Initial settings configuration

## Implementation Details

### Components
1. **OrganizationSetupWizard**
   - Located in: `components/admin/organization-setup-wizard.tsx`
   - Handles the multi-step form process
   - Uses Convex mutations for data persistence
   - Generates unique user IDs for organization admins

### Database Schema
```typescript
// Organizations Table
organizations: defineTable({
  name: v.string(),
  contactPerson: v.object({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  }),
  status: v.union(v.literal("active"), v.literal("inactive")),
  subscription: v.object({
    plan: v.string(),
    status: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
  }),
  createdAt: v.string(),
  updatedAt: v.string(),
})

// Users Table
users: defineTable({
  userId: v.string(),
  email: v.string(),
  name: v.string(),
  role: v.union(v.literal("super_admin"), v.literal("org_admin"), v.literal("team_leader"), v.literal("team_member")),
  organizationId: v.union(v.literal("SYSTEM"), v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
})
```

### Subscription Plans
Currently, all subscription plans (Basic, Professional, and Enterprise) provide access to the full feature set:
- Team creation and management
- Strategic Objectives (SOs) creation
- OKRs management
- KPIs tracking
- Team assignments

Future implementation will differentiate features based on subscription levels.

### User Roles and Access
1. **Super Admin**
   - Single super admin account (email: kushtrim@promnestria.biz)
   - Full system access
   - Can create and manage organizations
   - Can assign org_admin roles

2. **Organization Admin**
   - Created during organization setup
   - Manages their organization's settings
   - Can create teams and assign team leaders

### Organization Creation Flow
1. **Manual Creation (Current)**
   - Super admin creates organizations through admin dashboard
   - Uses multi-step wizard for organization setup
   - Automatically creates org_admin user

2. **Self-Service Creation (Planned)**
   - Organizations will self-register through landing page
   - "Get Started" flow will trigger organization creation
   - Automated verification and setup process

### Error Handling
1. Authentication Errors
   - Not authenticated
   - Not authorized (non-super admin)
2. Validation Errors
   - Missing required fields
   - Invalid data formats
3. Database Errors
   - Connection issues
   - Constraint violations

### Testing Checklist
1. ✅ Super admin authentication
2. ✅ Form validation
3. ✅ Data persistence
4. ✅ Error handling
5. ✅ Audit logging
6. ✅ User creation with unique IDs
7. ⏳ Email notifications
8. ⏳ Welcome flow

### Common Issues and Solutions

#### 1. Permission Denied Error
If you get "Only super admin can create organizations":
1. Verify user is authenticated
2. Check if user has super_admin role
3. Ensure `isSuperAdmin` function is working

#### 2. User Creation Errors
If user creation fails:
1. Check if userId is properly generated
2. Verify all required fields are provided
3. Ensure email format is valid

## Best Practices
1. Always validate input data
2. Implement proper error handling
3. Log all important actions
4. Maintain data consistency
5. Follow security protocols

## Next Steps
1. Implement email notifications
2. Add welcome flow
3. Configure subscription plan features
4. Implement self-service registration
5. Add organization verification process 