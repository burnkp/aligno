# Aligno v1 Development Progress Report

## 1. Project Overview
Aligno is a B2B SaaS platform for strategic alignment and performance management, built with:
- Next.js 14 (App Router)
- TypeScript
- Convex (Backend)
- Clerk (Authentication)
- Tailwind CSS + shadcn/ui

## 2. Core Infrastructure

### 2.1 Project Structure
The project follows a modular structure with key directories: 

### 2.2 Authentication (Clerk)
- **Configuration**: Implemented in root layout

### 2.3 Backend (Convex)

#### Data Models:
1. Teams Collection
2. Invitations Collection
3. Strategic Objectives Collection
4. Operational Key Results Collection
5. KPIs Collection
6. Users Collection

#### Convex Configuration
- **Auth Config**: `convex/auth.config.js` - Integrates with Clerk
- **API Generation**: Located in `convex/_generated/`
- **Data Operations**: 
  - Strategic Objectives: `convex/strategicObjectives.ts`
  - Operational Key Results: `convex/operationalKeyResults.ts`
  - Teams: `convex/teams.ts`
  - KPIs: `convex/kpis.ts`

## 3. Feature Implementation

### 3.1 Dashboard
- **Location**: `app/(dashboard)/(routes)/dashboard/page.tsx`
- **Features**:
  - Overview of SOs, OKRs, and KPIs
  - Progress tracking
  - Real-time updates via Convex

#### 3.1.1 Dashboard Components
1. **Summary Cards** (Top Section):
   - Total Objectives Counter
   - Average Progress Indicator
   - Upcoming Deadlines Tracker
   - At Risk Projects Monitor
   
2. **Recent Activity** (Middle Section):
   - Shows latest 5 objectives
   - Progress visualization
   - Due date tracking

3. **Team Progress** (Bottom Left):
   - Team-specific progress tracking
   - Average progress calculation per team
   - Visual progress indicators

4. **KPI Status** (Bottom Right):
   - Top 5 KPIs display
   - Current vs Target tracking
   - Progress visualization

#### 3.1.2 Data Calculations
Located in `app/(dashboard)/(routes)/dashboard/page.tsx`:
```typescript
// Summary Metrics
const totalObjectives = objectives?.length || 0;
const avgObjectiveProgress = objectives?.reduce((acc, obj) => 
  acc + obj.progress, 0) / totalObjectives || 0;

// Upcoming Deadlines (7-day window)
const upcomingDeadlines = objectives?.filter(obj => 
  new Date(obj.endDate) > new Date() && 
  new Date(obj.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
) || [];

// At Risk Projects (< 25% progress)
const atRiskCount = objectives?.filter(obj => obj.progress < 25).length || 0;

// Team Progress Calculation
const teamProgress = teams?.map(team => {
  const teamObjectives = objectives?.filter(obj => obj.teamId === team._id) || [];
  const avgProgress = teamObjectives.reduce((acc, obj) => 
    acc + obj.progress, 0) / teamObjectives.length || 0;
  return { team, avgProgress };
});
```

#### 3.1.3 Required Convex Queries
- **Strategic Objectives**: `api.strategicObjectives.getStrategicObjectives`
- **Operational Key Results**: `api.operationalKeyResults.getOperationalKeyResults`
- **KPIs**: `api.kpis.getKPIs`
- **Teams**: `api.teams.getTeams`

#### 3.1.4 UI Components Used
Located in `components/ui/`:
- Card, CardHeader, CardTitle, CardContent
- Progress
- Icons from lucide-react:
  - Target (Objectives)
  - BarChart3 (Progress)
  - Clock (Deadlines)
  - AlertCircle (Risks)

#### 3.1.5 Dependencies
```json
{
  "date-fns": "^3.3.1",
  "lucide-react": "^0.344.0"
}
```

#### 3.1.6 Dashboard Action Buttons
Located in `app/(dashboard)/(routes)/dashboard/page.tsx`:

1. **Add Objective Button**
   - Direct creation through CreateObjectiveModal
   - No parent selection needed
   - Connected to existing objective creation flow

2. **Add Key Result Button**
   - Two-step process:
     1. SelectParentModal for choosing parent objective
     2. CreateOKRModal for creating the key result
   - Uses existing OKR creation functionality

3. **Add KPI Button**
   - Two-step process:
     1. SelectParentModal for choosing parent OKR
     2. CreateKPIModal for creating the KPI
   - Connected to existing KPI creation flow

#### Implementation Details:
```typescript
// Modal States
const [isSelectObjectiveOpen, setIsSelectObjectiveOpen] = useState(false);
const [isSelectOKROpen, setIsSelectOKROpen] = useState(false);
const [selectedObjectiveId, setSelectedObjectiveId] = useState<Id<"strategicObjectives"> | null>(null);
const [selectedOKRId, setSelectedOKRId] = useState<Id<"operationalKeyResults"> | null>(null);

// Parent Selection Handlers
const handleObjectiveSelect = (id: Id<"strategicObjectives">) => {
  setSelectedObjectiveId(id);
  setIsSelectObjectiveOpen(false);
  setIsCreateOKROpen(true);
};

const handleOKRSelect = (id: Id<"operationalKeyResults">) => {
  setSelectedOKRId(id);
  setIsSelectOKROpen(false);
  setIsCreateKPIOpen(true);
};
```

#### 3.1.7 Data Calculations and Display
Located in `app/(dashboard)/(routes)/dashboard/page.tsx`:

1. **Summary Cards Data**:
   - Total Objectives: Direct count of objectives
   - Average Progress: Weighted average of all objectives
   - Upcoming Deadlines: Items due within 7 days
   - At Risk Items: Objectives with < 25% progress

2. **Recent Activity**:
   - Shows latest 5 objectives
   - Includes progress indicators and due dates
   - Color-coded status indicators

3. **Team Progress**:
   - Calculates per-team progress
   - Shows team-specific metrics
   - Visual progress indicators

#### Data Calculation Details:
```typescript
// Summary Metrics
const totalObjectives = objectives.length;
const avgObjectiveProgress = objectives.length 
  ? objectives.reduce((acc, obj) => acc + obj.progress, 0) / objectives.length 
  : 0;

// Upcoming Deadlines
const upcomingDeadlines = objectives.filter(obj => {
  const endDate = new Date(obj.endDate);
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);
  return endDate > now && endDate <= sevenDaysFromNow;
});

// At Risk Items
const atRiskItems = objectives.filter(obj => obj.progress < 25);

// Team Progress
const teamProgress = teams.map(team => {
  const teamObjectives = objectives.filter(obj => obj.teamId === team._id);
  const avgProgress = teamObjectives.length
    ? teamObjectives.reduce((acc, obj) => acc + obj.progress, 0) / teamObjectives.length
    : 0;
  return { team, avgProgress };
});
```

### 3.2 Analytics
- **Location**: `app/(dashboard)/(routes)/analytics/page.tsx`
- **Components**:
  - Overall Progress Chart
  - Team Performance Metrics
  - KPI Breakdown
  - Timeline Visualization

### 3.3 Teams Management
- **Location**: `app/(dashboard)/(routes)/teams/page.tsx`
- **Components**:
  - Team Creation Modal
  - Member Invitation System
  - Team Card Display
- **Data Operations**: Handled in `convex/teams.ts`

### 3.4 Objectives Management
- **Location**: `app/(dashboard)/(routes)/objectives/`
- **Features**:
  - Strategic Objectives Creation
  - OKR Assignment
  - Progress Tracking
  - Timeline View

## 4. Data Flow Architecture

### 4.1 Convex Integration
- **Client Provider**: `app/providers/convex-client-provider.tsx`
- **Data Fetching**: Using `useQuery` hook from Convex
- **Data Mutations**: Using Convex mutations for state changes
- **Real-time Updates**: Automatic through Convex subscriptions

### 4.2 Authentication Flow
1. User signs in/up through Clerk
2. Clerk token passed to Convex
3. Convex validates token and manages permissions
4. Protected routes enforce authentication

## 5. UI Components

### 5.1 Core Components
All located in `components/ui/`:
- Button
- Card
- Dialog
- Form
- Input
- Progress
- Select
- Tabs
- Toast

### 5.2 Feature Components
- **Analytics**: `components/analytics/`
  - Overall Progress
  - Team Performance
  - KPI Breakdown
  - Timeline Chart
- **Teams**: `components/teams/`
- **Objectives**: `components/objectives/`
- **OKRs**: `components/okr/`
- **KPIs**: `components/kpi/`

## 6. Environment Configuration

### 6.1 Environment Variables
Required in `.env.local`:
```plaintext
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=
CLERK_JWT_TEMPLATES=
```

## 7. Current Limitations and TODOs

### 7.1 Features to Implement
1. Email notification system
2. Advanced analytics filters
3. Batch operations for KPIs
4. Team performance comparisons
5. Historical data tracking

### 7.2 Technical Improvements Needed
1. Implement error boundaries
2. Add loading states
3. Enhance form validations
4. Add unit tests
5. Implement proper error handling
6. Add proper TypeScript types for all components

## 8. Development Workflow

### 8.1 Local Development
1. Install dependencies: `npm install`
2. Start both development servers simultaneously: `npm run dev`
   - This runs Next.js and Convex servers concurrently using:
     - `npm run next` for Next.js
     - `npm run convex` for Convex

### 8.2 Deployment
- Vercel for frontend
- Convex cloud for backend
- Clerk dashboard for auth management

## 9. Testing
Currently implemented:
- Basic auth flow testing
- Data operations validation
- UI component rendering

Needed:
- Unit tests
- Integration tests
- E2E tests
```

