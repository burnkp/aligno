# Aligno Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── (routes)/
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── [[...sign-up]]/
│   │   │   │       └── page.tsx
│   │   │   └── invite/
│   │   │       └── [token]/
│   │   │           └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── (routes)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── teams/
│   │   │   │   └── page.tsx
│   │   │   ├── objectives/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [objectiveId]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [okrId]/
│   │   │   │   │       └── page.tsx
│   │   │   └── analytics/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── providers/
│   │   ├── convex-client-provider.tsx
│   │   └── theme-provider.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── toast.tsx
│   ├── analytics/
│   │   ├── kpi-breakdown.tsx
│   │   ├── overall-progress.tsx
│   │   ├── team-performance.tsx
│   │   └── timeline-chart.tsx
│   ├── teams/
│   │   ├── create-team-modal.tsx
│   │   ├── invite-member-modal.tsx
│   │   └── team-card.tsx
│   ├── objectives/
│   │   ├── create-objective-modal.tsx
│   │   ├── objective-card.tsx
│   │   └── timeline.tsx
│   ├── okr/
│   │   ├── create-okr-modal.tsx
│   │   └── okr-card.tsx
│   ├── kpi/
│   │   ├── create-kpi-modal.tsx
│   │   ├── kpi-card.tsx
│   │   └── update-kpi-modal.tsx
│   ├── navbar.tsx
│   └── sidebar.tsx
├── convex/
│   ├── _generated/
│   ├── auth.config.js
│   ├── email.ts
│   ├── init.ts
│   ├── kpis.ts
│   ├── operationalKeyResults.ts
│   ├── schema.ts
│   ├── strategicObjectives.ts
│   └── teams.ts
├── lib/
│   └── utils.ts
├── public/
├── .env
├── .eslintrc.json
├── components.json
├── development-progress.md
├── middleware.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── projectstructure.md
├── tailwind.config.ts
└── tsconfig.json
```