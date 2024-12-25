# File Structure Documentation

## 1. Root Directory Structure
```
aligno/
├── app/                  # Next.js application routes
├── components/           # React components
├── convex/              # Backend functions and schema
├── lib/                 # Utility functions and shared code
├── public/              # Static assets
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── assets/              # Media assets
├── docs/                # Documentation files
├── config/              # Configuration files
├── __tests__/          # Test files
└── .github/            # GitHub configuration
```

## 2. Application Routes (`app/`)
```
app/
├── (auth)/             # Authentication routes
├── (dashboard)/        # Dashboard routes
├── admin/             # Admin panel routes
├── api/               # API routes
├── auth/              # Auth-related routes
├── auth-callback/     # Auth callback handling
├── dashboard/         # Main dashboard
├── get-started/       # Onboarding flow
├── invite/            # Team invitations
├── providers/         # App providers
├── sign-in/          # Sign in pages
├── layout.tsx        # Root layout
├── page.tsx          # Root page
└── globals.css       # Global styles
```

## 3. Components Structure (`components/`)
```
components/
├── admin/            # Admin-specific components
├── analytics/        # Analytics components
├── kpi/             # KPI-related components
├── landing/         # Landing page components
├── modals/          # Modal components
├── objectives/      # Objective components
├── okr/             # OKR components
├── permissions/     # Permission components
├── profile/         # User profile components
├── providers/       # Provider components
├── teams/           # Team management components
├── ui/              # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   └── ...
├── error-boundary.tsx
├── navbar.tsx
├── page-header.tsx
└── sidebar.tsx
```

## 4. Backend Structure (`convex/`)
```
convex/
├── _generated/       # Generated Convex files
├── lib/             # Backend utilities
├── mutations/       # Data mutations
├── queries/         # Data queries
├── analytics.ts     # Analytics functions
├── auditLogs.ts    # Audit logging
├── debug.ts        # Debug utilities
├── email.ts        # Email functionality
├── init.ts         # Initialization
├── invitations.ts  # Invitation handling
├── kpis.ts         # KPI management
├── migrations.ts   # Database migrations
├── organizations.ts # Organization management
├── schema.ts       # Database schema
├── teams.ts        # Team management
└── users.ts        # User management
```

## 5. Library Structure (`lib/`)
```
lib/
├── actions/         # Server actions
├── auth.ts         # Authentication utilities
├── auth-context.tsx # Auth context
├── email.ts        # Email utilities
├── email-templates.ts # Email templates
├── resend.ts       # Resend configuration
├── types.ts        # Shared types
└── utils.ts        # Utility functions
```

## 6. Configuration Files
```
├── .env                 # Environment variables
├── .env.local           # Local environment variables
├── components.json      # Shadcn UI configuration
├── convex.json         # Convex configuration
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vitest.config.ts    # Vitest configuration
```

## 7. Documentation Files (`docs/`)
```
docs/
├── APP-FLOWS.MD           # Application flows
├── BACKEND-STRUCTURE-DOC.MD # Backend structure
├── FILE-STRUCTURE.MD      # File structure
├── FRONTEND-GUIDELINES.MD # Frontend guidelines
├── PRD.md                # Product requirements
├── PRD-FINAL.MD          # Final product requirements
├── RolePermissions.md    # Role permissions
└── TECH-STACK.MD         # Technology stack
```

## 8. Testing Structure (`__tests__/`)
```
__tests__/
├── components/     # Component tests
├── hooks/         # Hook tests
├── lib/           # Library tests
└── utils/         # Utility tests
```

## 9. Type Definitions (`types/`)
```
types/
├── api.ts         # API types
├── auth.ts        # Authentication types
├── common.ts      # Common types
└── index.ts       # Type exports
```

## 10. Important Files

### 10.1 Core Configuration
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies

### 10.2 Environment Files
- `.env`: Base environment variables
- `.env.local`: Local environment overrides

### 10.3 Backend Files
- `convex/schema.ts`: Database schema
- `convex/auth.config.js`: Auth configuration
- `convex/init.ts`: Initialization

### 10.4 Frontend Files
- `app/layout.tsx`: Root layout
- `app/page.tsx`: Root page
- `components/ui/*`: UI components
- `lib/utils.ts`: Utility functions

## 11. File Naming Conventions

### 11.1 Component Files
- PascalCase for component files (e.g., `Button.tsx`)
- Kebab-case for directories (e.g., `ui-components`)

### 11.2 Utility Files
- Camel case for utility files (e.g., `utils.ts`)
- Descriptive prefixes (e.g., `useAuth.ts`)

### 11.3 Configuration Files
- Kebab-case for config files (e.g., `tailwind.config.ts`)
- Dot notation for special files (e.g., `.env.local`)

### 11.4 Documentation Files
- Uppercase with hyphens (e.g., `TECH-STACK.MD`)
- Clear, descriptive names
``` 