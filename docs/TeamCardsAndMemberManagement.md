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
  - Marked with a filled purple circle icon (`CircleDot`)
  - "(Team Leader)" label in purple
  - Name in medium font weight
- **Regular Members**: 
  - Marked with an outlined gray circle icon (`Circle`)
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

## Team Management

### Creating Teams
- **Create Team Button**:
  - Located at the top of the Teams page
  - Purple button with Plus icon
  - Opens create team modal
- **Create Team Modal**:
  - Form with team name (required) and description (optional)
  - Input validation using Zod
  - Success/error notifications using toast
  - Automatically updates UI after creation

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
- Requires confirmation via modal
- Deletes all associated data
- Updates UI immediately after deletion
- Stays on Teams page after deletion

## Implementation Details

### Components
1. `TeamCard`: Main component for displaying team information
   - Located in: `components/teams/team-card.tsx`
   - Uses Shadcn UI components for consistent styling
   - Implements role-based permission checks

2. `CreateTeamModal`: Modal for creating new teams
   - Located in: `components/teams/create-team-modal.tsx`
   - Form validation with Zod
   - Proper error handling and feedback
   - Matches purple theme

3. `InviteMemberModal`: Modal for sending invitations
   - Located in: `components/teams/invite-member-modal.tsx`
   - Integrates with email service
   - Validates email addresses

4. `RemoveMemberModal`: Modal for removing team members
   - Located in: `components/teams/remove-member-modal.tsx`
   - Shows filterable list of removable members
   - Implements proper error handling

5. `DeleteTeamModal`: Modal for team deletion
   - Located in: `components/teams/delete-team-modal.tsx`
   - Uses AlertDialog for confirmation
   - Proper error handling and state updates

### Database Operations (convex/teams.ts)
- `createTeam`: Creates new teams with proper member structure
- `inviteMember`: Handles member invitation process
- `removeMember`: Manages member removal with proper checks
- `deleteTeam`: Handles team deletion with authorization

### Permissions (utils/permissions.ts)
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
- Accessibility improvements:
  - Proper ARIA labels
  - Dialog descriptions
  - Keyboard navigation support

## Future Improvements
1. Add bulk member management
2. Implement member role changes
3. Add team transfer functionality
4. Enhanced activity logging
5. Member invitation tracking dashboard