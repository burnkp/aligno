# Landing Page Migration Plan

## 1. File Structure Changes

### Files to Keep
- `app/layout.tsx` - Root layout with providers
- All CONVEX and CLERK configuration files

### Files to Delete
- `app/page.tsx` (will be replaced with new implementation)
- `components/landing/hero-section.tsx`
- `components/landing/features-section.tsx`

### New File Structure
```
app/
├── page.tsx                    # New landing page implementation
└── layout.tsx                  # Existing root layout

components/
├── landing/                    # New landing components
│   ├── navbar.tsx
│   ├── hero.tsx
│   ├── features.tsx
│   ├── comparison-section.tsx
│   ├── how-it-works.tsx
│   ├── pricing.tsx
│   └── logo.tsx
└── ui/                        # Existing shadcn/ui components

styles/                        # New styles directory
├── animations.css
└── landing.css
```

## 2. Component Integration

### Navbar Component
- Integrate CLERK authentication
- Add dynamic rendering based on auth state
- Implement role-based navigation
- Connect "Sign In" button to CLERK modal
- Link "Start Free" to registration flow

### Hero Component
- Add CLERK authentication state handling
- Implement dynamic CTAs:
  - Authenticated: Show dashboard button
  - Non-authenticated: Show trial/demo buttons
- Add role-based routing logic
- Integrate with CONVEX for user data

### Features Component
- Maintain current structure
- Update styling to match new design
- No authentication integration needed

### New Components
- Add ComparisonSection
- Add HowItWorks
- Add Pricing with subscription integration

## 3. Authentication & Routing Updates

### CLERK Integration
```typescript
// Required imports
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Authentication state handling
const { isSignedIn, userId } = useAuth();
const { user: clerkUser } = useUser();
const router = useRouter();

// Role-based routing
const handleNavigation = () => {
  if (userEmail === "kushtrim@promnestria.biz") {
    router.push("/admin/dashboard");
  } else if (user?.role === "org_admin") {
    router.push(`/organizations/${user.organizationId}`);
  } else {
    router.push("/teams");
  }
};
```

### CONVEX Integration
```typescript
// Required imports
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// User data handling
const user = useQuery(api.users.getUser, { userId: userId ?? "" });
const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);
```

## 4. Styling Integration

### Tailwind Configuration
- Merge new color schemes
- Add custom animations
- Update typography settings

### Custom Styles
- Add new gradient definitions
- Implement animation classes
- Update responsive breakpoints

## 5. Implementation Steps

1. **Preparation**
   - Back up existing landing page files
   - Create new component directories
   - Update Tailwind configuration

2. **Core Components**
   - Implement new Navbar with auth
   - Add Hero section with dynamic content
   - Add Features grid
   - Implement remaining sections

3. **Authentication**
   - Integrate CLERK in new components
   - Test all auth flows
   - Verify role-based routing

4. **Styling**
   - Apply new styles
   - Test responsive design
   - Verify animations

5. **Testing**
   - Test all user flows
   - Verify auth integration
   - Check responsive design
   - Performance testing

## 6. Post-Migration Tasks

1. **Documentation**
   - Update component documentation
   - Document new user flows
   - Update authentication docs

2. **Optimization**
   - Optimize images
   - Verify load times
   - Check performance metrics

3. **Monitoring**
   - Set up error tracking
   - Monitor auth flows
   - Track conversion metrics 