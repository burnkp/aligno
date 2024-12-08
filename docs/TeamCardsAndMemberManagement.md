# Team Cards and Member Management

This document outlines the implementation of team cards and member management functionality in the application.

## Team Card Design

The team cards have been redesigned to provide a cleaner, more intuitive interface with the following features:

### Visual Elements
- **Card Layout**: Clean white background with subtle hover shadow
- **Team Name**: Large, bold title at the top
- **Description**: Secondary text below the title in gray
- **Member List**: Vertical list of team members with role indicators
- **Action Buttons**: Three action icons in the top-right corner

### Member Display
- **Team Leader**: 
  - Marked with a filled purple circle icon
  - "(Team Leader)" label in purple
  - Name in medium font weight
- **Regular Members**: 
  - Marked with an outlined gray circle icon
  - Regular font weight

### Action Icons
1. **Invite Member** (UserPlus icon):
   - Purple icon that opens the invite modal
   - Only visible to team admins
   - Allows sending email invitations to new members

2. **Remove Member** (UserMinus icon):
   - Purple icon that opens the remove member modal
   - Only visible to team admins
   - Shows a list of current members that can be removed
   - Cannot remove team admins

3. **Delete Team** (Trash2 icon):
   - Red icon that opens the delete confirmation modal
   - Only visible to team admins
   - Requires confirmation before deletion

## Member Management

### Adding Members
- Team admins can invite new members via email
- Invitations include:
  - Team name
  - Role assignment
  - Expiration date (7 days)
- Email notifications sent automatically
- Pending invitations tracked in the database

### Removing Members
- Team admins can remove regular members
- Restrictions:
  - Cannot remove team admins
  - Cannot remove yourself
- Changes reflect immediately in the UI
- Database updated automatically

### Team Deletion
- Only team admins can delete teams
- Requires confirmation
- Deletes all associated data
- Redirects to teams page after successful deletion

## Implementation Details

### Components
1. `TeamCard`: Main component for displaying team information
   - Located in: `components/teams/team-card.tsx`
   - Uses Shadcn UI components for consistent styling
   - Implements role-based permission checks

2. `InviteMemberModal`: Modal for sending invitations
   - Located in: `components/teams/invite-member-modal.tsx`
   - Integrates with email service
   - Validates email addresses

3. `RemoveMemberModal`: Modal for removing team members
   - Located in: `components/teams/remove-member-modal.tsx`
   - Shows filterable list of removable members
   - Implements proper error handling

4. `DeleteTeamModal`: Modal for team deletion
   - Located in: `components/teams/delete-team-modal.tsx`
   - Uses AlertDialog for confirmation
   - Handles navigation after deletion

### Database Operations
Located in `convex/teams.ts`:
- `inviteMember`: Handles member invitation process
- `removeMember`: Manages member removal with proper checks
- `deleteTeam`: Handles team deletion with authorization

### Permissions
Located in `utils/permissions.ts`:
- Role-based access control
- Separate functions for different permission checks
- Supports "admin" and "member" roles

## Error Handling
- Proper error messages for all operations
- User-friendly toast notifications
- Automatic UI updates after operations
- Graceful handling of edge cases

## UI/UX Considerations
- Consistent purple/white color scheme
- Clear visual hierarchy
- Responsive design
- Immediate feedback for user actions
- Smooth transitions and animations
- Clear confirmation dialogs for destructive actions

## Future Improvements
1. Add bulk member management
2. Implement member role changes
3. Add team transfer functionality
4. Enhanced activity logging
5. Member invitation tracking dashboard 