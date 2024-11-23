# Aligno - SaaS Webapp for Strategic Alignment and Performance Management

## 1. Overview
**Aligno** is a SaaS platform designed for B2B clients to manage and align their company's Strategic Objectives (SOs), Operational Key Results (OKRs), and Key Performance Indicators (KPIs) across teams and departments. The platform allows companies to create hierarchical performance structures, monitor progress interactively, and assign accountability to teams and individuals.

### Key Features:
- Manage **Teams/Departments** and their alignment to company-wide goals.
- Assign and track KPIs interactively at the team and individual levels.
- Use **Convex** for scalable, real-time backend services and **Clerk** for seamless authentication and user management.

---

## 2. Objectives
- **Enable B2B clients to organize and align performance goals** through hierarchical SOs, OKRs, and KPIs.
- **Provide team and role-based access control**, ensuring users can only view or edit relevant goals.
- **Streamline onboarding** for team members with automatic email invitations and an intuitive profile setup flow.
- **Deliver a sleek, modern UI** that is both functional and visually appealing.

---

## 3. Core Functionalities

### 3.1. Company-Level Features
- **Admin User (Company Administrator)**:
  - The primary user account for each client company.
  - Can create and manage all SOs, OKRs, and KPIs.
  - Assign Teams/Departments to specific SOs or OKRs.
  - Create Teams/Departments and invite members by specifying their name, email, and role.

### 3.2. Teams Page
- **Create Teams**:
  - The admin user can create Teams/Departments with:
    - A **Team Name** (e.g., "Marketing" or "Sales").
    - Assigned OKRs and KPIs for each Team.
- **Add Team Members**:
  - Invite members to a team by entering:
    - Full Name
    - Email Address
    - Role (Team Leader or Team Member)
  - Automatically send an email to the invited user, including:
    - A notification that they have been added to the team.
    - A link/button to access the app and complete their profile setup.

### 3.3. User Authentication and Profile Page
- **Authentication**:
  - Use **Clerk** for user management and authentication.
  - Automatically generate a Clerk account for invited users.
- **Profile Page**:
  - After authentication, users are redirected to their **Profile Page**, which displays:
    - The SOs, OKRs, and KPIs for the team(s) they belong to.
    - Options to add/update/modify any KPI cards assigned to them.
  - If permitted, users can view SOs, OKRs, and KPIs for other teams or the entire company.

### 3.4. Main Dashboard
- Display company-wide SOs, OKRs, and KPIs in a hierarchical structure:
  - **Strategic Objectives (SOs)**: Shown at the top with progress bars and descriptions.
  - **Operational Key Results (OKRs)**: Nested under their respective SOs.
  - **Key Performance Indicators (KPIs)**: Nested under OKRs, with fields for current value, target value, and status.
- **Interactivity**:
  - Expand/collapse sections for better navigation.
  - Inline editing for KPIs, allowing real-time updates to progress values.

### 3.5. Analytics Page
- Visualize performance metrics through charts and graphs:
  - Filter by Team, SO, or OKR to view progress trends and breakdowns.
  - Use bar charts, line graphs, and pie charts for easy analysis.
- Display key insights, such as "Top Performing Teams" or "Lagging Metrics."

---

## 4. User Roles and Permissions

### 4.1. Admin User (Company Administrator)
- Full access to create and manage SOs, OKRs, KPIs, Teams, and Users.
- Can assign teams to specific SOs or OKRs and invite new users.
- Has visibility into all company-wide metrics and analytics.

### 4.2. Team Leader
- Full access to their assigned team’s SOs, OKRs, and KPIs.
- Can update OKRs and KPIs for their team.
- Limited visibility into other teams (based on admin-defined permissions).

### 4.3. Team Member
- Can view their assigned team’s SOs, OKRs, and KPIs.
- Can add/update/modify KPIs assigned to them but cannot edit OKRs or SOs.

---

## 5. UI/UX Guidelines

### 5.1. Design Goals
- **Modern and Professional**:
  - Use **shadcn UI components** for consistency and aesthetic quality.
  - Clean typography and intuitive layouts to ensure usability.
- **Responsive**:
  - Ensure all pages are optimized for desktop, tablet, and mobile.
- **Interactive**:
  - Use animations for expanding/collapsing sections and modal transitions.
  - Provide hover effects for better interactivity.

### 5.2. Page Layouts

#### **Main Dashboard**:
- Hierarchical structure for SOs, OKRs, and KPIs.
- Collapsible sections with inline editing for KPIs.

#### **Teams Page**:
- Grid or table view for managing teams, their members, and roles.
- Modals for creating teams and inviting users.

#### **Analytics Page**:
- Charts and graphs for visualizing performance metrics.
- Filterable views for specific teams, SOs, or OKRs.

#### **Profile Page**:
- Display team-specific goals (SOs, OKRs, KPIs) assigned to the user.
- Editable KPI cards for updating progress.

---

## 6. Backend and Authentication

### 6.1. Backend: Convex
- Use **Convex** for scalable, real-time backend services:
  - Store SOs, OKRs, KPIs, Teams, and User data.
  - Enable real-time updates for all changes across the platform.
  - Enforce permissions and access controls based on user roles.

### 6.2. Authentication: Clerk
- Use **Clerk** for user authentication and management:
  - Automatically handle user sign-ups, logins, and session management.
  - Integrate Clerk's webhook to sync user data with Convex.
  - Ensure secure user access based on their assigned roles and teams.

---

## 7. Webapp Flow Documentation

### 7.1. Administrator Flow
1. Log in to the app using Clerk authentication.
2. Create SOs, OKRs, and KPIs for the company.
3. Navigate to the Teams Page to:
   - Create teams and assign OKRs/KPIs to them.
   - Invite users to join teams by specifying their name, email, and role.
4. Use the Main Dashboard to monitor company-wide progress.
5. Access the Analytics Page for performance insights.

### 7.2. Team Leader/Member Flow
1. Accept the email invitation and authenticate through Clerk.
2. View the SOs, OKRs, and KPIs assigned to their team on the Profile Page.
3. Update their assigned KPIs interactively from their Profile Page.
4. Navigate to the Dashboard to view overall team progress.

---

## 8. Tools and Technologies

### 8.1. Frontend
  - Design the dashboard, Teams page, Analytics page, and Profile page.
  - Implement modals, collapsible views, and interactive elements.

### 8.2. Backend
- Use **Convex** for:
  - Data storage and real-time updates.
  - Permission handling for user roles and team-specific access.

### 8.3. Authentication
- Use **Clerk** to:
  - Manage user authentication and onboarding.
  - Send automatic email invitations to new users.
