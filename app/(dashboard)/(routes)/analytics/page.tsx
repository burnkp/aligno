"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverallProgress } from "@/components/analytics/overall-progress";
import { TeamPerformance } from "@/components/analytics/team-performance";
import { KPIBreakdown } from "@/components/analytics/kpi-breakdown";
import { TimelineChart } from "@/components/analytics/timeline-chart";

export default function AnalyticsPage() {
  const teams = useQuery(api.teams.getTeams);
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults);
  const kpis = useQuery(api.kpis.getKPIs);

  if (!teams || !objectives || !okrs || !kpis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strategic Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{objectives.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OKRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{okrs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Team Performance</TabsTrigger>
          <TabsTrigger value="kpis">KPI Breakdown</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverallProgress 
            objectives={objectives}
            okrs={okrs}
            kpis={kpis}
          />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamPerformance 
            teams={teams}
            objectives={objectives}
            okrs={okrs}
            kpis={kpis}
          />
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <KPIBreakdown 
            teams={teams}
            kpis={kpis}
          />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineChart 
            objectives={objectives}
            okrs={okrs}
            kpis={kpis}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}