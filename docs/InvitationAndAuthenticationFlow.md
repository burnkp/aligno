# Team Invitation and Authentication Flow

## Overview
This document details the complete flow for team invitations, user authentication, and team member management in the application.

## Flow Steps

### 1. Teams List View
- Teams are displayed in a responsive grid layout
- Each team card shows:
  - Team name and description
  - Member list with avatars and roles
  - Invite button (for admins/leaders)
- Loading states with skeletons
- Proper type safety with TypeScript

### 2. Sending Invitations
- Team admin/leader sends invitation via email through the Team Card interface
- System generates secure token
- Invitation stored in database with status "pending"
- Email sent via Resend with invitation link

### 3. Authentication Flow
- User clicks invitation link in email
- System checks authentication status:
  - If not authenticated:
    1. Shows "Authentication Required" page
    2. Stores invitation token in sessionStorage
    3. When "Sign in to Accept" is clicked:
       - Implements rate limiting (1 attempt per 5 seconds)
       - Shows loading/redirection states
       - Redirects to Clerk authentication
    4. After successful auth, returns to invitation page
  - If authenticated:
    1. Automatically proceeds to invitation acceptance

### 4. Rate Limiting and Error Handling
- Client-side rate limiting:
  - Limits sign-in attempts to once every 5 seconds
  - Shows user-friendly messages for rate limiting
- State Management:
  - Tracks redirection status
  - Prevents multiple sign-in attempts
  - Handles Clerk API limits gracefully
- Error Handling:
  - Catches and logs authentication errors
  - Shows user-friendly error messages
  - Provides clear feedback on rate limiting

### 5. Invitation Acceptance
- System validates:
  - Invitation exists and is pending
  - Invitation hasn't expired
  - User isn't already a team member
- On successful validation:
  1. Updates invitation status to "accepted"
  2. Adds user to team members with proper role
  3. Redirects to team profile page

### 6. Team Profile Access
- User sees:
  - Welcome message with team name
  - Their role in the team
  - Team description
  - Strategic Objectives (if any)
  - KPIs (if any)
  - Options to add new OKRs/KPIs

## Implementation Details

### Key Files and Functions

1. `app/invite/[token]/page.tsx`
```typescript
// Authentication and Invitation Handling
const handleSignIn = () => {
  try {
    // Rate limiting check
    const now = Date.now();
    if (now - lastAttempt < 5000) {
      toast({
        title: "Please wait",
        description: "Too many attempts. Please try again in a few seconds.",
      });
      return;
    }

    setLastAttempt(now);
    setIsRedirecting(true);
    sessionStorage.setItem('pendingInvitationToken', params.token);
    
    // Redirect to Clerk's sign-in
    window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`;
  } catch (error) {
    handleSignInError(error);
  }
};

// Auto-accept after authentication
useEffect(() => {
  if (isLoaded) {
    if (!isSignedIn) {
      sessionStorage.setItem('pendingInvitationToken', params.token);
    } else if (user) {
      handleAcceptInvitation();
    }
  }
}, [isLoaded, isSignedIn, user, params.token]);
```

2. `convex/teams.ts`
```typescript
// Accept invitation mutation
export const acceptInvitation = mutation({
  args: {
    token: v.string(),
    userId: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    // ... validation and acceptance logic
  },
});
```

### Database Schema
```typescript
teams: defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.string(),
  members: v.array(
    v.object({
      userId: v.string(),
      email: v.string(),
      name: v.string(),
      role: v.union(
        v.literal("super_admin"),
        v.literal("org_admin"),
        v.literal("team_leader"),
        v.literal("team_member")
      ),
      joinedAt: v.optional(v.string())
    })
  )
})

invitations: defineTable({
  teamId: v.id("teams"),
  email: v.string(),
  name: v.string(),
  role: v.union(
    v.literal("org_admin"),
    v.literal("team_leader"),
    v.literal("team_member")
  ),
  status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
  createdAt: v.string(),
  updatedAt: v.string()
})
```

### Important Implementation Notes

1. **Rate Limiting**
```typescript
// Client-side rate limiting
const now = Date.now();
if (now - lastAttempt < 5000) {
  // Show rate limit message
  return;
}
```

2. **State Management**
```typescript
const [isRedirecting, setIsRedirecting] = useState(false);
const [lastAttempt, setLastAttempt] = useState(0);
```

3. **Error Recovery**
```typescript
if (error) {
  setIsRedirecting(false);
  toast({
    title: "Error",
    description: "Failed to initiate sign-in. Please try again.",
  });
}
```

### Security Considerations

1. **Authentication Flow**
- Rate limiting to prevent abuse
- Secure token storage
- Clear error handling
- State management for UI feedback

2. **Token Security**
- Tokens include timestamp component
- Single-use tokens
- 7-day expiration
- Secure storage in sessionStorage

3. **Access Control**
- Only team admins/leaders can invite
- Email-based invitation acceptance
- Role-based permissions

## Debugging and Monitoring

### Common Issues and Solutions

1. **Rate Limiting**
- Check client-side rate limiting
- Monitor Clerk API limits
- Use proper error handling

2. **Invalid Links**
- Ensure proper token validation
- Check expiration handling
- Verify invitation status

3. **Authentication Flow**
- Monitor sign-in attempts
- Check redirection handling
- Verify token persistence

### Monitoring Tools

1. **Clerk Dashboard**
- Monitor authentication attempts
- Track rate limiting
- View user sessions

2. **Application Logs**
- Track sign-in attempts
- Monitor rate limiting
- Log authentication errors

3. **User Experience**
- Loading states
- Error messages
- Redirection handling

## Related Documentation
- NewUserToUserProfilePageFlow.md - Initial flow documentation
- email-invite-feature-FINAL.md - Email invitation implementation

# Access Control and Role-Based Permissions

## Latest Implementation Updates

### 1. Teams List View
- Separated teams into two sections:
  - "Your Teams" for teams user is a member of
  - "Pending Invitations" for teams user has been invited to
- Added proper null checks and default values
- Improved loading states with Skeleton components

### 2. TeamCard Component
- Added role-based visibility for actions
- Improved UI with hover effects and transitions
- Shows different states for member vs invitee views
- Limited member avatars display to 5 with counter

### 3. Server-Side Implementation
```typescript
// teams.ts - List Query
export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get teams where user is a member
    const memberTeams = await ctx.db
      .query("teams")
      .filter(q => 
        q.eq(
          q.field(q.field("members"), "userId"),
          identity.subject
        )
      )
      .collect();

    // Get teams with pending invitations
    const pendingInvitations = await ctx.db
      .query("invitations")
      .filter(q => 
        q.and(
          q.eq(q.field("email"), identity.email!),
          q.eq(q.field("status"), "pending")
        )
      )
      .collect();

    return {
      memberTeams,
      invitedTeams: invitedTeams.filter(Boolean)
    };
  },
});
```

### 4. Client-Side Implementation
```typescript
// TeamCard Component
interface TeamCardProps {
  id: Id<"teams">;
  name: string;
  description?: string;
  members: TeamMember[];
  isMember: boolean;
}

export function TeamCard({ id, name, description, members, isMember }: TeamCardProps) {
  const userRole = isMember ? getUserRole({ _id: id, members }, user.id) : null;
  const canInvite = userRole && canInviteMembers(userRole);

  // Render different actions based on role and membership
  return (
    <Card>
      <CardHeader>
        {isMember && canInvite && (
          <Button onClick={handleInvite}>Invite</Button>
        )}
      </CardHeader>
      <CardFooter>
        <Button variant={isMember ? "default" : "secondary"}>
          {isMember ? "View Team" : "View Invitation"}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 5. Permission Utilities
```typescript
// utils/permissions.ts
export const hasPermission = (userRole: Role, requiredPermission: Permission): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole];
  return userPermissions.includes(requiredPermission);
};

export const getUserRole = (team: Team, userId: string): Role | null => {
  const member = team.members.find(m => m.userId === userId);
  return member?.role || null;
};
```

## Security Considerations

### 1. Data Access
- Server-side filtering of accessible teams
- Proper null checks for undefined data
- Type-safe implementation with TypeScript

### 2. UI Security
- Role-based rendering of actions
- Clear visual distinction between member and invitee views
- Proper loading and error states

### 3. Permission Checks
- Double-layered permission checking:
  1. Server-side in Convex functions
  2. Client-side for UI rendering
- Proper handling of edge cases

## Best Practices Implemented

1. **Defensive Programming**
   - Null checks for all data
   - Default values for arrays
   - Type safety throughout

2. **Performance**
   - Optimized database queries
   - Efficient UI updates
   - Proper loading states

3. **User Experience**
   - Clear role-based UI
   - Proper loading indicators
   - Intuitive action buttons

## Testing Guidelines

1. **Access Control Tests**
   - Verify team visibility
   - Check invitation access
   - Test role-based actions

2. **UI Tests**
   - Loading states
   - Empty states
   - Role-based rendering

3. **Permission Tests**
   - Member vs non-member access
   - Role-based permissions
   - Invitation handling

## Related Documentation
- InvitationAndAuthenticationFlow.md
- NewUserToUserProfilePageFlow.md