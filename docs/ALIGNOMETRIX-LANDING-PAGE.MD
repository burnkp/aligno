# Aligno Landing Page Documentation

## Overview
The Aligno landing page is a modern, responsive web application built with Next.js, React, TypeScript, and Tailwind CSS. It features a clean, professional design with interactive elements, smooth animations, and a mobile-first approach.

## Page Structure
The landing page consists of the following main sections:
1. Navigation Bar
2. Hero Section
3. Features Grid
4. Comparison Section (Old Way vs Aligno Way)
5. How It Works
6. Pricing Section

## Components Breakdown

### 1. Navigation Bar (`components/landing/navbar`)
- Fixed position with transparent to solid background on scroll
- Logo and navigation links
- Authentication-aware buttons:
  - Non-authenticated: "Sign In" and "Start Free"
  - Authenticated: "Go to Dashboard"
- Mobile-responsive hamburger menu
- Implemented using shadcn/ui components

### 2. Hero Section (`components/landing/hero`)
- Main headline: "Transform Your Company's Performance"
- Subheadline with value proposition
- Call-to-action buttons:
  - Primary: "Start Free Trial"
  - Secondary: "Sign In"
- Social proof section with company logos:
  - Google
  - Amazon
  - Netflix
  - IBM
- Background features:
  - Gradient background (`bg-gradient-to-br from-brand-purple-50/50 via-white to-blue-50/50`)
  - Grid pattern overlay
  - Animated fade-in effects

### 3. Features Grid (`components/landing/features`)
- Section title: "Everything you need for strategic excellence"
- 6 feature cards in a responsive grid:
  1. Strategic Team Alignment
  2. Performance Analytics
  3. Enterprise Security
  4. Agile Performance
  5. Continuous Support
  6. Data Protection
- Each card includes:
  - Icon with custom color
  - Title
  - Description
  - Hover animations
  - Custom background colors

### 4. Comparison Section
- Title: "The Old Way vs The Aligno Way"
- Two-column layout comparing traditional vs Aligno approach
- Key differentiators highlighted
- Custom gradient background with pattern overlay
- Animated bullet points

### 5. How It Works
- Three-step process visualization
- Numbered steps with icons
- Connected layout with arrows
- Step descriptions
- Responsive design adapting to mobile view

### 6. Pricing Section (`components/landing/pricing`)
- Title: "Simple, Transparent Pricing"
- Three-tier pricing structure:
  1. Starter ($29/month)
  2. Professional ($79/month)
  3. Enterprise ($199/month)
- Features for each plan
- "Most Popular" highlight for Professional plan
- Custom gradient background
- Interactive hover states
- Responsive grid layout

## Color Palette
- Primary Purple: `#7C3AED` (brand-purple-600)
- Secondary Blue: `#2563EB` (blue-600)
- Background Gradients:
  - Purple to White: `from-brand-purple-50/50 via-white to-blue-50/50`
  - Purple to Indigo: `from-purple-600 to-indigo-700`
- Text Colors:
  - Headlines: `text-gray-900`
  - Body: `text-gray-600`
  - Muted: `text-gray-500`
- Accent Colors:
  - Success: `text-emerald-500`
  - Warning: `text-amber-500`
  - Info: `text-blue-500`

## Typography
- Headlines:
  - Font: System font stack with Inter as primary
  - Sizes: 
    - H1: `text-5xl md:text-6xl`
    - H2: `text-3xl md:text-4xl`
    - H3: `text-2xl`
- Body Text:
  - Regular: `text-base`
  - Large: `text-lg`
  - Small: `text-sm`
- Font Weights:
  - Regular: `font-normal`
  - Medium: `font-medium`
  - Semibold: `font-semibold`
  - Bold: `font-bold`

## Animations
- Fade Up: `animate-fade-up`
- Fade In: `animate-fade-in`
- Hover Transitions:
  - Scale: `hover:scale-105`
  - Shadow: `hover:shadow-xl`
  - Background: `hover:bg-brand-purple-50`
- Loading States:
  - Pulse: `animate-pulse`
  - Spin: `animate-spin`

## Responsive Design
- Mobile First Approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px
- Grid Layouts:
  - Mobile: Single column
  - Tablet: Two columns
  - Desktop: Three columns or more
- Responsive Typography
- Flexible Spacing System

## UI Components (shadcn/ui)
- Button
  - Variants: default, outline, ghost
  - Sizes: default, sm, lg
- Card
  - CardHeader
  - CardContent
  - CardFooter
- Navigation Menu
- Icons from Lucide React

## Performance Optimizations
- Next.js Image Component for optimized images
- Code Splitting
- Lazy Loading
- Optimized Fonts
- Minimized CSS with Tailwind
- Responsive Image Sizing
- Cached Components

## Accessibility
- Semantic HTML Structure
- ARIA Labels
- Keyboard Navigation
- Focus Management
- Color Contrast Compliance
- Screen Reader Support
- Alt Text for Images

## Best Practices
- Mobile-First Development
- Progressive Enhancement
- Performance Optimization
- Cross-Browser Compatibility
- SEO Best Practices
- Clean Code Structure
- Maintainable Components
- Reusable Styles

## Development Guidelines
1. Use TypeScript for type safety
2. Follow component composition patterns
3. Implement responsive design principles
4. Maintain consistent styling with Tailwind
5. Ensure accessibility compliance
6. Optimize for performance
7. Write clean, maintainable code
8. Document component usage
9. Test across browsers
10. Follow SEO best practices 