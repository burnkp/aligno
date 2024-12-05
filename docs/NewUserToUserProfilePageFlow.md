# New User to User Profile Page Flow

## Overview
This document details the complete flow from when a new user receives an invitation email to when they can access their team dashboard.

## Flow Steps

### 1. Email Reception & Click
- User receives invitation email from Resend
- Email contains personalized invitation link with secure token
- Link format: `${appUrl}/invite/${invitationToken}`

### 2. Initial Landing Page
**File**: `app/invite/[token]/page.tsx`
- Validates invitation token
- Checks user authentication status
- Shows appropriate UI based on auth state

### 3. Authentication Flow
**Files**:
- `app/invite/[token]/page.tsx`: Main invitation page
- `convex/invitations.ts`: Token validation
- `convex/teams.ts`: Team membership management

#### States:
1. **Unauthenticated User**:
   - Shows Clerk SignIn component
   - Maintains invitation context
   - Handles authentication redirect

2. **Authenticated User**:
   - Validates email matches invitation
   - Shows acceptance UI
   - Handles team joining process

### 4. Team Joining Process
**File**: `convex/teams.ts` 

typescript
acceptInvitation mutation:
Validates invitation token
Verifies user email
Adds user to team
Updates invitation status
Logs acceptance

### 5. Dashboard Redirect
**Files**:
- `app/dashboard/teams/[teamId]/page.tsx`: Team dashboard
- `convex/teams.ts`: Team data queries
- `components/dashboard/TeamView.tsx`: Dashboard UI

## Implementation Details

### Database Schema

typescript:docs/NewUserToUserProfilePageFlow.md
// Invitations Table
{
teamId: Id<"teams">;
email: string;
name: string;
role: "leader" | "member";
token: string;
status: "pending" | "accepted" | "expired";
expiresAt: string;
createdBy: string;
createdAt: string;
}
// Teams Table
{
name: string;
members: Array<{
userId: string;
email: string;
name: string;
role: string;
joinedAt: string;
}>;
}


### Security Measures
1. Token Validation
2. Email Verification
3. Expiration Checks
4. Role-based Access

### Error Handling
1. Invalid Tokens
2. Expired Invitations
3. Email Mismatches
4. Already Accepted

## Testing Checklist
- [ ] Email delivery
- [ ] Token validation
- [ ] Authentication flow
- [ ] Team joining
- [ ] Dashboard access
- [ ] Error handling

## Monitoring
- Email delivery status: `/email-debug`
- Invitation status: `/resend`
- Authentication logs: Clerk Dashboard
- Database records: Convex Dashboard

