"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  BarChart,
  Activity,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

export function AnalyticsOverview() {
  // Direct data fetching from tables
  const organizations = useQuery(api.organizations.getAllOrganizations);
  const users = useQuery(api.users.getAllUsers);
  const teams = useQuery(api.teams.getAllTeams);
  const auditLogs = useQuery(api.auditLogs.getAllLogs);

  if (!organizations || !users || !teams || !auditLogs) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate active users
  const now = new Date();
  const dailyUsers = new Set();
  const weeklyUsers = new Set();
  const monthlyUsers = new Set(users.map(user => user.userId));

  auditLogs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    const daysDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 1) dailyUsers.add(log.userId);
    if (daysDiff <= 7) weeklyUsers.add(log.userId);
  });

  // Calculate team metrics
  const totalTeams = teams.length;
  const activeTeams = teams.filter(team => team.members && team.members.length > 0);

  // Calculate action metrics
  const actionTypes = [
    "create_organization",
    "create_strategic_objective",
    "create_operational_key_result",
    "create_kpi",
    "create_team",
    "add_team_member"
  ];

  const actionsByType = actionTypes.reduce((acc, type) => {
    acc[type] = auditLogs.filter(log => log.action === type).length;
    return acc;
  }, {} as Record<string, number>);

  const totalActions = Object.values(actionsByType).reduce((a, b) => a + b, 0);

  // Prepare chart data
  const userActivityData = [
    { name: 'Daily', value: dailyUsers.size },
    { name: 'Weekly', value: weeklyUsers.size },
    { name: 'Monthly', value: monthlyUsers.size },
  ];

  const actionData = Object.entries(actionsByType).map(([type, count]) => ({
    name: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: count,
  }));

  return (
    <div className="space-y-8">
      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Organizations
              </p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold">{organizations.length}</h2>
                <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  Active
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Teams
              </p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold">{totalTeams}</h2>
                <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  {activeTeams.length} active
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <div className="flex items-baseline">
                <h2 className="text-3xl font-bold">{users.length}</h2>
                <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  Active
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* User Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Actions Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={actionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Action Type Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(actionsByType).map(([type, count]) => (
          <Card key={type} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground capitalize">
                  {type.split('_').join(' ')}
                </p>
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-bold">{count}</h2>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {((count / totalActions) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 