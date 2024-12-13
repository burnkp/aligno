# New User Account Creation Flow

## Overview
This document outlines the implementation of the new user account creation flow in the Aligno application.

## Flow Steps

1. **Organization Creation**
   - User fills out organization creation form at `/get-started`
   - Form collects: Organization Name, User's Name, Email
   - Data is validated and stored in Convex database

2. **Email Confirmation**
   - Welcome email sent via Resend API
   - Email contains secure sign-in link with organization context
   - Link format: `/sign-in?redirect_url=/auth/setup&email={email}&orgName={orgName}`

3. **Authentication Flow**
   - User clicks email link
   - Redirected to Clerk authentication
   - After successful authentication:
     - User is redirected to `/auth/setup`
     - Clerk ID is associated with organization user
     - Finally redirected to organization dashboard

4. **Dashboard Access**
   - User lands on organization-specific dashboard
   - Dashboard displays empty state for new organizations
   - All necessary data queries are initialized

## Implementation Details

### Email Template
- Located in `lib/email.ts`
- Uses Resend API for delivery
- Includes organization context in sign-in URL
- Proper error handling for email sending

### Middleware Configuration
- Handles public and protected routes
- Manages authentication flow
- Redirects unauthenticated users to sign-in
- Preserves organization context through redirects

### Auth Setup Page
- Handles post-authentication flow
- Updates user's Clerk ID in database
- Ensures proper organization association
- Manages redirection to dashboard

### Security Considerations
- All sensitive routes are protected
- Organization context is preserved securely
- Email verification is required
- Proper error handling throughout flow

## Error Handling

1. **Email Sending**
   - Validates required environment variables
   - Handles Resend API errors
   - Provides clear error messages

2. **Authentication**
   - Handles missing or invalid parameters
   - Manages authentication failures
   - Provides fallback routes

3. **Database Operations**
   - Validates data before storage
   - Handles Convex operation failures
   - Maintains data consistency

## Testing Considerations

1. **Email Flow**
   - Verify email delivery
   - Check link construction
   - Test error scenarios

2. **Authentication**
   - Test sign-in process
   - Verify organization context
   - Check redirect behavior

3. **Database**
   - Verify user association
   - Check organization data
   - Test error recovery

## Future Improvements

1. **Enhanced Security**
   - Add rate limiting
   - Implement IP-based restrictions
   - Add additional verification steps

2. **User Experience**
   - Add progress indicators
   - Improve error messages
   - Add retry mechanisms

3. **Monitoring**
   - Add analytics tracking
   - Implement error logging
   - Add performance monitoring