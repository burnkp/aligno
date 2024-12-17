# Super Admin Analytics

## Overview
The analytics dashboard in the super admin section provides high-level insights into platform usage, organization performance, and user activity. It features interactive charts and real-time data visualization using direct data fetching from the database.

## Implementation Details

### Components
1. **AnalyticsOverview**
   - Located in: `components/admin/analytics-overview.tsx`
   - Uses direct Convex queries for real-time data
   - Features interactive charts using Recharts
   - Single-page layout with all metrics visible

### Data Fetching
1. **Direct Table Queries**
   ```typescript
   // Direct data fetching from tables
   const organizations = useQuery(api.organizations.getAllOrganizations);
   const users = useQuery(api.users.getAllUsers);
   const teams = useQuery(api.teams.getAllTeams);
   const auditLogs = useQuery(api.auditLogs.getAllLogs);
   ```

2. **Query Implementation**
   ```typescript
   // Get all teams
   export const getAllTeams = query({
     args: {},
     handler: async (ctx) => {
       const teams = await ctx.db.query("teams").collect();
       return teams;
     },
   });
   ```

### Metric Calculations
1. **Team Metrics**
   ```typescript
   const totalTeams = teams.length;
   const activeTeams = teams.filter(team => team.members && team.members.length > 0);
   ```

2. **Action Metrics**
   ```typescript
   const actionsByType = actionTypes.reduce((acc, type) => {
     acc[type] = auditLogs.filter(log => log.action === type).length;
     return acc;
   }, {} as Record<string, number>);
   ```

### Features

1. **Main Metrics**
   - Total Organizations count (direct from organizations table)
   - Total Teams count (direct from teams table)
   - Total Users count (direct from users table)
   - All metrics update in real-time

2. **User Activity Chart**
   - Line chart showing daily/weekly/monthly active users
   - Interactive tooltips
   - Responsive design

3. **Actions Distribution**
   - Bar chart showing action type distribution
   - Detailed breakdown cards for each action type
   - Percentage calculations of total actions

### Tracked Actions
The following actions are specifically tracked and counted:
- Organization creation (`create_organization`)
- Strategic objective creation (`create_strategic_objective`)
- Operational key result creation (`create_operational_key_result`)
- KPI creation (`create_kpi`)
- Team creation (`create_team`)
- Team member addition (`add_team_member`)

### Access Control
- Only accessible to super admin
- Direct data access through simple queries
- Consistent with dashboard access patterns

### Data Flow
1. **Data Collection**
   - Direct queries to all relevant tables
   - No filtering or complex logic
   - Consistent with dashboard queries

2. **Data Processing**
   - Simple count calculations
   - Active team determination
   - Action type aggregation

### Testing Checklist
1. ✅ Super admin access control
2. ✅ Direct data fetching
3. ✅ Metric calculations
4. ✅ Real-time updates
5. ✅ Chart rendering
6. ✅ Data accuracy

## Best Practices
1. Use simple, direct table queries
2. Match dashboard query patterns
3. Calculate metrics on the client
4. Use proper data indexing
5. Implement error handling
6. Provide loading states

## Next Steps
1. Add more action types to track
2. Implement data export
3. Add custom date ranges
4. Add trend analysis
5. Implement caching for better performance