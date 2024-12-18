"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverallProgress } from "@/components/analytics/overall-progress";
import { TeamPerformance } from "@/components/analytics/team-performance";
import { KPIBreakdown } from "@/components/analytics/kpi-breakdown";
import { TimelineChart } from "@/components/analytics/timeline-chart";
import { Id } from "@/convex/_generated/dataModel";

interface ProgressItem {
  _id: string;
  title: string;
  progress: number;
  startDate: string;
  teamId: string;
}

export default function AnalyticsPage() {
  const teams = useQuery(api.teams.getTeams);
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, { strategicObjectiveId: undefined });
  const kpis = useQuery(api.kpis.getKPIs, {
    operationalKeyResultId: undefined,
    teamId: undefined,
    assignedTo: undefined,
  });

  if (!teams || !objectives || !okrs || !kpis) {
    return <div>Loading...</div>;
  }

  // Transform the data to match the expected types
  const transformedObjectives: ProgressItem[] = objectives.map((obj: any) => ({
    _id: obj._id.toString(),
    title: obj.title || "",
    progress: typeof obj.progress === "number" ? obj.progress : 0,
    startDate: obj.startDate || new Date().toISOString(),
    teamId: obj.teamId || "",
  }));

  const transformedOKRs: ProgressItem[] = okrs.map((okr: any) => ({
    _id: okr._id.toString(),
    title: okr.title || "",
    progress: typeof okr.progress === "number" ? okr.progress : 0,
    startDate: okr.startDate || new Date().toISOString(),
    teamId: okr.teamId || "",
  }));

  const transformedKPIs: ProgressItem[] = kpis.map((kpi: any) => ({
    _id: kpi._id.toString(),
    title: kpi.title || "",
    progress: typeof kpi.progress === "number" ? kpi.progress : 0,
    startDate: kpi.startDate || new Date().toISOString(),
    teamId: kpi.teamId || "",
  }));

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
            objectives={transformedObjectives}
            okrs={transformedOKRs}
            kpis={transformedKPIs}
          />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamPerformance 
            teams={teams}
            objectives={transformedObjectives}
            okrs={transformedOKRs}
            kpis={transformedKPIs}
          />
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <KPIBreakdown 
            teams={teams}
            kpis={transformedKPIs}
          />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <TimelineChart 
            objectives={transformedObjectives}
            okrs={transformedOKRs}
            kpis={transformedKPIs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}