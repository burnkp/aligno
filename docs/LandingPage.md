# Aligno Landing Page Documentation

## Overview
The landing page serves as the main entry point for Aligno, featuring a modern and responsive design with a hero section and features showcase. The page is built using Next.js and implements various UI components from Shadcn UI.

## File Structure

```
├── app/
│   ├── page.tsx                    # Main landing page component
│   ├── layout.tsx                  # Root layout with providers
│   └── get-started/
│       └── page.tsx                # Get started page component
├── components/
│   ├── landing/
│   │   ├── hero-section.tsx        # Hero section component
│   │   └── features-section.tsx    # Features showcase component
│   └── ui/                         # Shadcn UI components
```

## Components Breakdown

### 1. Main Landing Page (`app/page.tsx`)
- Simple and clean structure
- Renders two main sections:
  - HeroSection
  - FeaturesSection

### 2. Hero Section (`components/landing/hero-section.tsx`)
- Main welcome component with CTAs
- Features:
  - Dynamic welcome message with Aligno branding
  - Responsive layout
  - Authentication state handling
  - Role-based dashboard redirection
  - CTAs:
    - Get Started (for non-authenticated users)
    - Sign In (for non-authenticated users)
    - Go to Dashboard (for authenticated users)

### 3. Features Section (`components/landing/features-section.tsx`)
- Showcases key platform features
- Grid layout with 6 feature cards:
  1. Team Management
  2. Real-time Analytics
  3. Enterprise Security
  4. Fast Performance
  5. 24/7 Support
  6. Data Privacy
- Each card includes:
  - Icon
  - Title
  - Description

## Authentication Flow

### Non-authenticated Users
- Can view the landing page
- Have access to:
  - "Get Started" button
  - "Sign In" button
- Redirected to authentication flow when attempting to access protected routes

### Authenticated Users
- See personalized dashboard button
- Automatic role-based routing:
  - Super Admin → `/admin/dashboard`
  - Organization Admin → `/organizations/{orgId}`
  - Team Leader/Member → `/teams`

## Styling

- Uses Tailwind CSS for responsive design
- Implements custom gradients and animations
- Responsive breakpoints:
  - Mobile-first approach
  - Tablet optimization
  - Desktop layouts

## Technical Implementation

### State Management
- Uses Clerk for authentication state
- Implements Convex for real-time data updates
- Manages user roles and permissions

### Performance Optimizations
- Server-side rendering with Next.js
- Optimized image loading
- Minimal client-side JavaScript
- Efficient routing with Next.js App Router

## Integration Points

### Authentication (Clerk)
- Sign-in modal integration
- User session management
- Role-based access control

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