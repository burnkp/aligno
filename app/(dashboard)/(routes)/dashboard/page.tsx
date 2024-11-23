"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users, BarChart3, LineChart } from "lucide-react";

export default function DashboardPage() {
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives, {});
  const teams = useQuery(api.teams.getTeams, {});
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, {});
  const kpis = useQuery(api.kpis.getKPIs, {});

  if (!objectives || !teams || !okrs || !kpis) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse bg-gray-100 h-8" />
              <CardContent className="animate-pulse bg-gray-50 h-16" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const calculateAverageProgress = (items: Array<{ progress: number }> | undefined) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => acc + item.progress, 0) / items.length;
  };

  const objectivesProgress = calculateAverageProgress(objectives);
  const okrsProgress = calculateAverageProgress(okrs);
  const kpisProgress = calculateAverageProgress(kpis);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Strategic Objectives</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{objectives?.length || 0}</div>
            <Progress value={objectivesProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">OKRs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{okrs?.length || 0}</div>
            <Progress value={okrsProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active KPIs</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.length || 0}</div>
            <Progress value={kpisProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Strategic Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives?.slice(0, 5).map((objective) => (
                <div key={objective._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{objective.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {teams?.find(team => team._id === objective.teamId)?.name}
                    </p>
                  </div>
                  <Progress value={objective.progress} className="w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpis?.slice(0, 5).map((kpi) => (
                <div key={kpi._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{kpi.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Current: {kpi.currentValue} / Target: {kpi.targetValue}
                    </p>
                  </div>
                  <Progress value={kpi.progress} className="w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}