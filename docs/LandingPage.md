# Aligno Landing Page Documentation

## Overview
The landing page serves as the main entry point for Aligno, featuring a modern and responsive design with a hero section and features showcase. The page is built using Next.js and implements various UI components from Shadcn UI.

## Authentication Flow

### Non-authenticated Users
- Can view the landing page
- Have access to:
  - "Sign In" button in navbar (triggers Clerk authentication modal)
  - "Start Free" button in navbar (routes to `/get-started`)
  - "Start Free Trial" button in hero section (routes to `/get-started`)
- No access to protected routes or dashboard features
- All auth-related buttons have smooth transitions and no flashing states

### Authenticated Users
- See personalized navigation:
  - "Go to Dashboard" button (replaces "Start Free" and "Start Free Trial")
  - "Sign Out" button (replaces "Sign In")
- Automatic role-based routing from dashboard button:
  - Super Admin → `/admin/dashboard`
  - Organization Admin → `/organizations/{orgId}`
  - Team Leader/Member → `/teams`

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
    - "Start Free" → Routes to `/get-started`
  - Authenticated:
    - "Go to Dashboard" → Role-based routing
    - "Sign Out" → Clerk sign out
- Smooth transitions and loading states

### 3. Hero Section (`components/landing/hero/index.tsx`)
- Main welcome component with CTAs
- Authentication-aware buttons:
  - Non-authenticated:
    - "Start Free Trial" → Routes to `/get-started`
    - "Sign In" → Opens Clerk modal
  - Authenticated:
    - Single "Go to Dashboard" button with role-based routing
- Social proof section with company logos
- Smooth transitions and loading states

### 4. Features Section (`components/landing/features-section.tsx`)
- Showcases key platform features
- Grid layout with 6 feature cards
- Each card includes:
  - Icon
  - Title
  - Description

## Technical Implementation

### State Management
- Uses Clerk for authentication state
- Implements Convex for real-time data updates
- Manages user roles and permissions
- Smooth loading states and transitions

### Role-based Routing
- Super Admin detection via email
- Organization Admin routing with organization context
- Team Leader/Member routing to team dashboard

### Performance Optimizations
- Server-side rendering with Next.js
- Optimized image loading
- Minimal client-side JavaScript
- Efficient routing with Next.js App Router
- Smooth transitions for auth state changes

## Integration Points

### Authentication (Clerk)
- Sign-in modal integration
- User session management
- Role-based access control
- Sign-out functionality
- Smooth loading states

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