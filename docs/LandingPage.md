# Aligno Landing Page Documentation

## Overview
The landing page serves as the main entry point for Aligno, featuring a modern and responsive design with a hero section and features showcase. The page is built using Next.js and implements various UI components from Shadcn UI.

## Authentication Flow

### Non-authenticated Users
- Can view the landing page and `/get-started` page
- Have access to:
  - "Sign In" button in navbar (triggers Clerk authentication modal)
  - "Start Free" button in navbar (direct route to `/get-started` using Next.js Link)
  - "Start Free Trial" button in hero section (direct route to `/get-started` using Next.js Link)
- No access to protected routes or dashboard features
- All auth-related buttons have smooth transitions and no flashing states

### Authenticated Users
- See personalized navigation:
  - "Go to Dashboard" button (replaces "Start Free" and "Start Free Trial")
  - "Sign Out" button (replaces "Sign In")
- Automatic role-based routing from dashboard button:
  - Super Admin (kushtrim@promnestria.biz) → `/admin/dashboard`
  - Organization Admin → `/organizations/{orgId}`
  - Team Leader/Member → `/teams`

## Route Protection

### Public Routes
The following routes are accessible without authentication:
- `/` - Landing page
- `/get-started` - Organization setup page
- `/sign-in` - Authentication page
- `/sign-up` - Registration page

### Protected Routes
- All other routes require authentication
- Super admin routes (`/admin/*`) require additional email verification
- Unauthorized access attempts are redirected to appropriate pages

### Middleware Implementation
```typescript
// Key middleware features
{
  publicRoutes: ["/", "/get-started", "/sign-in", "/sign-up"],
  afterAuth: async (auth, req) => {
    // Public route access
    // Super admin verification
    // Role-based routing
    // Error handling
  }
}
```

## Components Breakdown

### 1. Main Landing Page (`app/page.tsx`)
- Simple and clean structure
- Renders main sections:
  - Navbar
  - Hero
  - Features
  - Comparison
  - How It Works
  - Pricing

### 2. Navbar Component (`components/landing/navbar/index.tsx`)
- Fixed position navigation with dynamic background
- Responsive design with mobile menu
- Authentication-aware buttons:
  - Non-authenticated:
    - "Sign In" → Opens Clerk modal
    - "Start Free" → Direct route to `/get-started` using Next.js Link
  - Authenticated:
    - "Go to Dashboard" → Role-based routing
    - "Sign Out" → Clerk sign out
- Smooth transitions and loading states

### 3. Hero Section (`components/landing/hero/index.tsx`)
- Main welcome component with CTAs
- Authentication-aware buttons:
  - Non-authenticated:
    - "Start Free Trial" → Direct route to `/get-started` using Next.js Link
    - "Sign In" → Opens Clerk modal
  - Authenticated:
    - Single "Go to Dashboard" button with role-based routing
- Social proof section with company logos
- Smooth transitions and loading states

## Technical Implementation

### State Management
- Uses Clerk for authentication state
- Implements Convex for real-time data updates
- Manages user roles and permissions
- Smooth loading states and transitions

### Role-based Routing
- Super Admin detection via email (kushtrim@promnestria.biz)
- Automatic redirection from `/dashboard` to `/admin/dashboard` for super admin
- Organization Admin routing with organization context
- Team Leader/Member routing to team dashboard

### Performance Optimizations
- Server-side rendering with Next.js
- Optimized image loading
- Minimal client-side JavaScript
- Efficient routing with Next.js App Router
- Smooth transitions for auth state changes

## Recent Fixes and Improvements

### 1. Middleware Configuration
- Fixed public routes pattern to use exact paths instead of wildcards
- Added `/get-started` to public routes
- Improved route protection logic
- Enhanced super admin redirection handling

### 2. Button Navigation
- Updated Start Free buttons to use Next.js Link for client-side routing
- Removed CLERK triggers from non-auth buttons
- Maintained proper auth flow for Sign In button
- Fixed navigation paths and redirects

### 3. Authentication Flow
- Improved super admin detection and routing
- Enhanced error handling in middleware
- Added proper logging for debugging
- Fixed authentication state management

### 4. Documentation Updates
- Added comprehensive route protection documentation
- Updated component behavior descriptions
- Added recent fixes and improvements section
- Enhanced technical implementation details

## Integration Points

### Authentication (Clerk)
- Sign-in modal integration
- User session management
- Role-based access control
- Sign-out functionality
- Smooth loading states
- Super admin redirection handling

### Database (Convex)
- User data management
- Organization/team structure
- Real-time updates

## Future Enhancements
- Add more interactive elements
- Implement feature previews
- Add customer testimonials section
- Enhance mobile responsiveness
- Add more CTAs and conversion points