# Team Member Email Invitation System - Final Implementation

## Overview
This document details the final working implementation of the team member invitation system using Convex and Resend for email delivery.

## Configuration Requirements

### Environment Variables

## Core Components

### 1. Email Sending Action (convex/email.ts)
This action handles the actual email sending through Resend:

typescript
export const sendInvitation = action({
args: {
email: v.string(),
name: v.string(),
teamId: v.string(),
teamName: v.string(),
role: v.string(),
invitationToken: v.string(),
},
handler: async (ctx, args) => {
const apiKey = process.env.RESEND_API_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!apiKey || !appUrl) {
throw new Error("Email service not configured");
}
const resend = new Resend(apiKey);
const invitationLink = ${appUrl}/invite/${args.invitationToken};
const { data, error } = await resend.emails.send({
from: 'Aligno <onboarding@resend.dev>',
to: [args.email],
subject: You've been invited to join ${args.teamName} on Aligno,
html: <h2>Hello ${args.name},</h2> <p>You've been invited to join ${args.teamName} as a ${args.role}.</p> <p>Click the link below to accept your invitation:</p> <a href="${invitationLink}">Accept Invitation</a> ,
});
if (error) throw error;
return { success: true, data };
},
});


### 2. Invitation Creation (convex/teams.ts)
This mutation handles creating the invitation and triggering the email:


typescript
export const inviteMember = mutation({
args: {
teamId: v.string(),
email: v.string(),
name: v.string(),
role: v.union(v.literal("leader"), v.literal("member")),
},
handler: async (ctx, args) => {
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");
const team = await ctx.db.get(args.teamId as Id<"teams">);
if (!team) throw new Error("Team not found");
const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
let invitationId = null;
try {
// Store invitation
invitationId = await ctx.db.insert("invitations", {
teamId: args.teamId as Id<"teams">,
email: args.email,
name: args.name,
role: args.role,
token,
status: "pending",
expiresAt: new Date(Date.now() + 7 24 60 60 1000).toISOString(),
createdBy: identity.subject,
createdAt: new Date().toISOString(),
});
// Schedule email
await ctx.scheduler.runAfter(0, internal.email.sendInvitation, {
email: args.email,
name: args.name,
teamId: args.teamId,
teamName: team.name,
role: args.role,
invitationToken: token,
});
return { success: true };
} catch (error) {
if (invitationId) await ctx.db.delete(invitationId);
throw error;
}
},
});


## Database Schema

### Invitations Table

ypescript
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



### Email Logs Table

typescript
{
email: string;
teamId: string;
status: string;
error?: string;
details?: string;
timestamp: string;
environment: string;
}


## Flow Description

1. **Invitation Initiation**
   - User clicks "Invite Member" in team card
   - Opens modal with form for email, name, and role

2. **Invitation Creation**
   - Form submission triggers `inviteMember` mutation
   - Generates unique invitation token
   - Creates invitation record in database
   - Schedules immediate email sending

3. **Email Sending**
   - `sendInvitation` action executes
   - Constructs invitation link with token
   - Sends email via Resend
   - Logs attempt in database

4. **Invitation Acceptance**
   - Recipient clicks link in email
   - System validates token and email match
   - Updates team members and invitation status

## Error Handling
- Invalid/expired invitations are rejected
- Failed email sends trigger invitation deletion
- All attempts are logged for debugging
- Email mismatches prevent unauthorized accepts

## Debugging Tools

1. **Email Debug Page** (`/email-debug`)
   - Tests email configuration
   - Views email logs
   - Displays configuration status

2. **Resend Logs Page** (`/resend`)
   - Shows detailed email delivery logs
   - Includes timestamps and error details
   - Helps track email statuses

## Key Success Factors
1. Using `scheduler.runAfter(0)` for reliable email scheduling
2. Proper error handling and rollback
3. Comprehensive logging
4. Environment variable validation
5. Secure token generation
6. Email validation checks

## Testing
To test the system:
1. Configure environment variables
2. Use test email configuration page
3. Send test invitation
4. Verify email delivery
5. Check logs for success/failure

## Maintenance Notes
- Monitor Resend API usage
- Check email logs regularly
- Update email templates as needed
- Maintain environment variables
- Monitor invitation expiration


## Implementation Details

### Key Files Structure

/convex
├── email.ts # Email sending actions and logging
├── teams.ts # Team and invitation management
├── schema.ts # Database schema definition
└── generated/ # Generated types and APIs
/app
└── (dashboard)
└── (routes)
├── email-debug/ # Email testing interface
└── resend/ # Email logs viewer
/components
└── teams
└── invite-member-modal.tsx # Invitation UI

### Important Implementation Notes

1. **Token Generation**

typescript
const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

This creates a unique, time-based token for each invitation.

2. **Email Scheduling**
typescript
await ctx.scheduler.runAfter(0, internal.email.sendInvitation, {
email: args.email,
name: args.name,
teamId: args.teamId,
teamName: team.name,
role: args.role,
invitationToken: token,
});

Using `scheduler.runAfter(0)` ensures reliable email delivery.

3. **Error Recovery**

typescript
if (invitationId) await ctx.db.delete(invitationId);

Cleans up failed invitations to prevent orphaned records.

### Security Considerations

1. **Email Validation**
- Verify email ownership during acceptance
- Check invitation expiration
- Validate team membership

2. **Token Security**
- Tokens include timestamp component
- Single-use tokens
- 7-day expiration

3. **Access Control**
- Only team admins/leaders can invite
- Email-based invitation acceptance
- Role-based permissions

## Debugging and Monitoring

### Common Issues and Solutions

1. **Emails Not Sending**
- Check Resend API key in Convex environment variables
- Verify sender domain configuration in Resend
- Check email logs in `/resend` page

2. **Invalid Links**
- Ensure `NEXT_PUBLIC_APP_URL` is correctly set
- Check token generation and storage
- Verify invitation record creation

3. **Failed Invitations**
- Check Convex Functions logs for errors
- Verify team existence and permissions
- Check email format and validation

### Monitoring Tools

1. **Convex Dashboard**
- Monitor function executions
- Check error rates
- View database records

2. **Resend Dashboard**
- Track email delivery rates
- Monitor bounces and complaints
- View email analytics

3. **Application Logs**
- `/email-debug` for configuration testing
- `/resend` for delivery status
- Browser console for client-side errors

## Testing Checklist

1. **Configuration Testing**
- [ ] Verify environment variables
- [ ] Test email configuration
- [ ] Check Resend domain setup

2. **Functional Testing**
- [ ] Create new invitation
- [ ] Verify email delivery
- [ ] Test invitation acceptance
- [ ] Check team member addition

3. **Error Testing**
- [ ] Test expired invitations
- [ ] Test invalid tokens
- [ ] Test email mismatch
- [ ] Test duplicate invitations

## Maintenance and Updates

### Regular Tasks
1. Monitor invitation expiration
2. Clean up expired invitations
3. Check email delivery rates
4. Update email templates
5. Review error logs

### Performance Optimization
1. Batch email processing
2. Index optimization
3. Cache frequently accessed data
4. Monitor function execution times

## Future Improvements
1. HTML email templates
2. Bulk invitations
3. Invitation reminders
4. Analytics dashboard
5. Custom role support

