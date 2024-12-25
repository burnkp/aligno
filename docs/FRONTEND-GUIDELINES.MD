# Frontend Guidelines

## 1. Component Architecture

### 1.1 Core Principles
- Use functional components with TypeScript
- Implement React Server Components (RSC) by default
- Only use 'use client' when necessary for client-side interactivity
- Follow atomic design principles for component organization
- Maintain single responsibility principle

### 1.2 Component Organization
```
components/
├── ui/              # shadcn/ui base components
├── admin/           # admin-specific components
├── analytics/       # analytics and reporting components
├── forms/           # form-related components
├── layout/          # layout components
└── shared/          # shared/common components
```

## 2. Styling System

### 2.1 Tailwind CSS Configuration
- Custom color scheme with CSS variables
- Responsive breakpoints
- Custom animations and transitions
- Brand colors and gradients
- Dark mode support

### 2.2 Color System
```typescript
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  brand: {
    purple: {
      50: '#f5f3ff',
      // ... other shades
      900: '#4c1d95',
    },
  },
}
```

### 2.3 Animation System
```typescript
keyframes: {
  'fade-up': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'fade-down': {
    '0%': { opacity: '0', transform: 'translateY(-10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
}
```

## 3. UI Components (shadcn/ui)

### 3.1 Core Components
- Button: Base component for all actions
- Card: Content container with variants
- Dialog: Modal and drawer implementations
- Form: Form handling with react-hook-form
- Tabs: Navigation and content organization

### 3.2 Usage Guidelines
- Use existing components from `/components/ui`
- Maintain consistent styling and behavior
- Follow accessibility best practices
- Implement proper error handling
- Use proper TypeScript types

## 4. Best Practices

### 4.1 Performance
- Implement code splitting
- Use dynamic imports for large components
- Optimize images with next/image
- Minimize client-side JavaScript
- Implement proper caching strategies

### 4.2 Accessibility
- Use semantic HTML elements
- Implement ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

### 4.3 State Management
- Use React Context for global state
- Implement local state with useState
- Avoid prop drilling
- Use custom hooks for shared logic
- Implement proper loading states

### 4.4 Error Handling
- Implement error boundaries
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI
- Handle edge cases

## 5. Responsive Design

### 5.1 Breakpoints
```typescript
// Mobile first approach
sm: '640px',   // Small devices
md: '768px',   // Medium devices
lg: '1024px',  // Large devices
xl: '1280px',  // Extra large devices
2xl: '1536px', // 2X Extra large devices
```

### 5.2 Layout Guidelines
- Use flexbox and grid for layouts
- Implement proper spacing
- Use relative units (rem, em)
- Test on multiple devices
- Ensure content readability

## 6. Forms and Validation

### 6.1 Form Components
- Use shadcn/ui form components
- Implement proper validation
- Show clear error messages
- Handle loading states
- Maintain consistent styling

### 6.2 Form Validation
```typescript
// Example form validation
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

## 7. Code Style

### 7.1 Naming Conventions
- Use PascalCase for components
- Use camelCase for functions and variables
- Use kebab-case for file names
- Use descriptive names
- Add type prefixes when helpful

### 7.2 File Structure
```typescript
// Component file structure
import { dependencies }
import { types }
import { components }

// Component definition
export const ComponentName = () => {
  // hooks
  // state
  // effects
  // handlers
  // render
}
```

## 8. Testing

### 8.1 Testing Guidelines
- Write unit tests for components
- Implement integration tests
- Use React Testing Library
- Test accessibility
- Test error states

### 8.2 Example Test
```typescript
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

## 9. Documentation

### 9.1 Component Documentation
- Add JSDoc comments
- Document props and types
- Include usage examples
- Document side effects
- Note dependencies

### 9.2 Example Documentation
```typescript
/**
 * Button component with variants
 * @param variant - The style variant
 * @param size - The size variant
 * @param children - The button content
 */
```

## 10. Performance Monitoring

### 10.1 Metrics to Monitor
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### 10.2 Tools
- Lighthouse
- Web Vitals
- Chrome DevTools
- Next.js Analytics
- Custom monitoring
``` 