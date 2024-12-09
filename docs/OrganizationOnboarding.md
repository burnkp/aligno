# Organization Onboarding Process

## Overview

This document details the complete process of onboarding a new organization (customer) to Aligno, from initial creation by the Super Admin to the organization being fully set up and operational.

## Process Flow

### 1. Organization Creation (Super Admin)

#### Actions
1. Super Admin logs into `/admin/dashboard`
2. Navigates to "Add New Organization" section
3. Fills out organization details:
   - Organization name
   - Contact person information
   - Subscription details
   - Initial org_admin details

#### Technical Implementation
```typescript
// Organization creation mutation
async function createOrganization(
  ctx: Context,
  args: {
    name: string;
    contactPerson: {
      name: string;
      email: string;
      phone?: string;
    };
    subscription: {
      plan: string;
      startDate: string;
    };
  }
): Promise<Id<"organizations">> {
  // Implementation details will be added during development
}
```

### 2. Organization Admin Invitation

#### Process
1. System generates secure invitation token
2. Sends email to designated org_admin
3. Email contains:
   - Welcome message
   - Organization details
   - Setup instructions
   - Secure invitation link

#### Security Considerations
- Invitation tokens expire after 7 days
- One-time use only
- Validates email match
- Requires secure password creation

### 3. Organization Admin Setup

#### First-Time Login
1. org_admin clicks invitation link
2. Creates account or links existing one
3. Validates email ownership
4. Sets up security preferences

#### Initial Configuration
1. Review organization details
2. Set up initial teams
3. Configure basic organizational settings
4. Review available features

### 4. Team Setup

#### Process
1. org_admin creates initial teams
2. Defines team structures
3. Sets up team leaders
4. Configures team-specific settings

#### Technical Implementation
```typescript
// Team creation mutation
async function createTeam(
  ctx: Context,
  args: {
    organizationId: Id<"organizations">;
    name: string;
    description?: string;
    leaderId?: string;
  }
): Promise<Id<"teams">> {
  // Implementation details will be added during development
}
```

### 5. Member Invitations

#### Process
1. org_admin/team_leaders invite team members
2. System sends role-specific invitations
3. Members accept and set up accounts
4. Automatic role assignment

## Security Measures

### Access Control
- Role-based permissions from first login
- Organization data isolation
- Audit logging of setup actions

### Validation
- Email domain verification
- Token validation
- Role verification

## Testing Checklist

- [ ] Organization creation flow
- [ ] Invitation email delivery
- [ ] Admin account setup
- [ ] Team creation process
- [ ] Member invitation flow
- [ ] Permission enforcement
- [ ] Data isolation verification

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------| 