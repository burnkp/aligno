# Aligno Application User Flows

## 1. Authentication Flows

### 1.1 Initial Landing Page Flow
1. User arrives at `/` (landing page)
2. Views landing page content (Hero, Features, Pricing)
3. Two primary paths:
   - Sign In (existing users)
   - Start Free Trial (new users)

### 1.2 Sign In Flow
1. User clicks "Sign In" button
2. Clerk authentication modal opens
3. User authenticates via:
   - Email/password
   - OAuth providers
4. After successful authentication:
   - Super Admin → `/admin/dashboard`
   - Organization Admin → `/organizations/{orgId}`
   - Team Leader/Member → `/teams`

### 1.3 New Organization Flow
1. User clicks "Start Free Trial"
2. Redirected to `/get-started`
3. Fills organization setup form
4. Email verification through Clerk
5. Organization created in database
6. Welcome email sent via Resend
7. Redirected to organization dashboard

## 2. Team Management Flows

### 2.1 Team Creation Flow
1. Organization Admin accesses Teams page
2. Clicks "Create Team" button
3. Fills team details:
   - Team name
   - Description
   - Initial members
4. Team created in database
5. Invitations sent to members

### 2.2 Team Invitation Flow
1. Team Admin/Leader clicks "Invite Member"
2. Fills invitation form:
   - Email
   - Name
   - Role (Team Leader/Team Member/Org Admin)
3. System:
   - Generates invitation token
   - Stores invitation in database
   - Sends email via Resend
4. Recipient:
   - Receives email
   - Clicks invitation link
   - Authenticates/Creates account
   - Automatically joins team

### 2.3 Team Member Management Flow
1. Team Admin/Leader accesses team settings
2. Can perform actions:
   - View all members
   - Change member roles
   - Remove members
   - Manage invitations

## 3. Dashboard Flows

### 3.1 Organization Admin Dashboard Flow
1. Admin logs in
2. Redirected to organization dashboard
3. Access to:
   - Organization overview
   - Team management
   - Member management
   - Analytics
   - Settings

### 3.2 Team Leader Dashboard Flow
1. Leader logs in
2. Redirected to team dashboard
3. Access to:
   - Team overview
   - Member management
   - OKRs/KPIs management
   - Team analytics

### 3.3 Team Member Dashboard Flow
1. Member logs in
2. Redirected to team dashboard
3. Access to:
   - Team overview
   - Assigned KPIs
   - Team analytics

## 4. Objectives and KPIs Management

### 4.1 Strategic Objectives Flow
1. Admin/Leader creates Strategic Objective
2. Sets:
   - Title
   - Description
   - Timeline
   - Team assignment
3. System:
   - Creates objective
   - Notifies team members
   - Updates analytics

### 4.2 OKRs Management Flow
1. Admin/Leader creates OKR
2. Links to Strategic Objective
3. Sets:
   - Title
   - Description
   - Target metrics
   - Timeline
4. System updates:
   - Team dashboard
   - Progress tracking
   - Analytics

### 4.3 KPIs Management Flow
1. Admin/Leader creates KPI
2. Links to OKR
3. Sets:
   - Title
   - Description
   - Current/Target values
   - Assignee
4. System:
   - Creates KPI
   - Notifies assignee
   - Updates analytics

## 5. Analytics and Reporting

### 5.1 Analytics Dashboard Flow
1. User accesses Analytics page
2. Views multiple tabs:
   - Overview
   - Team Performance
   - KPI Breakdown
   - Timeline
3. Can:
   - Filter data
   - View charts
   - Export reports

### 5.2 Team Analytics Flow
1. Team Leader/Admin accesses team analytics
2. Views:
   - Team performance metrics
   - Member contributions
   - Progress tracking
   - Historical data

## 6. Super Admin Flows

### 6.1 Admin Dashboard Flow
1. Super Admin logs in (kushtrim@promnestria.biz)
2. Accesses `/admin/dashboard`
3. Access to:
   - System overview
   - All organizations
   - User management
   - System settings
   - Global analytics

### 6.2 Organization Management Flow
1. Super Admin accesses Organizations page
2. Can:
   - View all organizations
   - Create new organizations
   - Manage organization settings
   - Access organization data

### 6.3 User Management Flow
1. Super Admin accesses Users page
2. Can:
   - View all users
   - Manage user roles
   - Reset user access
   - Monitor user activity

## 7. Error Handling Flows

### 7.1 Authentication Errors
1. System detects auth error
2. Shows appropriate error message
3. Provides recovery options:
   - Retry authentication
   - Reset password
   - Contact support

### 7.2 Permission Errors
1. User attempts unauthorized action
2. System:
   - Blocks action
   - Shows permission error
   - Logs attempt
   - Provides guidance

### 7.3 System Errors
1. System detects error
2. Shows user-friendly error message
3. Logs error details
4. Provides:
   - Retry option
   - Alternative action
   - Support contact 