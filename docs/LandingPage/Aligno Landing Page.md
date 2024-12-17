I'll provide a comprehensive breakdown of the tech stack and architecture of the Aligno landing page:

Core Technology Stack
Frontend Framework

React (v18.3.1) with TypeScript
Vite as the build tool and development server
Styling and UI

Tailwind CSS for styling
shadcn/ui for pre-built components
Lucide React for icons
CSS animations and transitions
Project Structure
Root Configuration Files

├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── components.json       # shadcn/ui configuration
Source Code Organization

src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation bar
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features grid
│   ├── ComparisonSection.tsx  # Old vs New comparison
│   ├── HowItWorks.tsx   # Process steps
│   ├── Pricing.tsx      # Pricing plans
│   └── Logo.tsx         # Logo component
├── lib/
│   └── utils.ts         # Utility functions
├── hooks/
│   └── use-toast.ts     # Toast notifications hook
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
Key Components Breakdown
Navbar (Navbar.tsx)

Fixed position navigation
Responsive design
Links to sections
CTA buttons (Sign In, Start Free)
Uses shadcn/ui Button component
Hero Section (Hero.tsx)

Main headline and subheadline
CTA buttons
Social proof section
Gradient background with grid pattern
Animation effects
Features Grid (Features.tsx)

Grid layout of key features
Lucide icons for each feature
Hover animations
Responsive design
Comparison Section (ComparisonSection.tsx)

Side-by-side comparison
Custom gradient background
Check/X icons for comparison points
Responsive layout
How It Works (HowItWorks.tsx)

Step-by-step process
Numbered steps with icons
Connected layout with arrows
Responsive design
Pricing Section (Pricing.tsx)

Three-tier pricing structure
Feature lists
Popular plan highlight
CTA buttons
Responsive grid layout
Styling Approach
Tailwind CSS Classes

Utility-first approach
Custom animations
Responsive design utilities
Custom color scheme
Custom CSS (index.css)

CSS variables for theming
Animation keyframes
Base styles
Dark/light mode support
Key Features
Responsive Design

Mobile-first approach
Breakpoint-based layouts
Flexible grids and spacing
Animations

Fade-up animations on scroll
Hover effects
Smooth transitions
Performance

Code splitting
Optimized images
Lazy loading
Accessibility

Semantic HTML
ARIA labels
Keyboard navigation
Color contrast compliance
Integration Points
Component Communication

Props for data passing
Context for global state (if needed)
Custom hooks for shared logic
Asset Management

Public folder for static assets
SVG icons from Lucide
Optimized images
Build Process

TypeScript compilation
CSS processing
Asset optimization
Bundle creation
Development Tools
TypeScript

Type safety
Better IDE support
Enhanced maintainability
ESLint

Code quality
Consistency enforcement
Best practices
Vite

Fast development server
Hot module replacement
Efficient building
This architecture provides a solid foundation for:

Easy maintenance and updates
Scalability
Performance optimization
Team collaboration
Feature additions
The modular approach allows for easy updates and modifications while maintaining clean code organization and separation of concerns.