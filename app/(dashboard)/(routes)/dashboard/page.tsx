"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users, BarChart3, LineChart, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults);
  const kpis = useQuery(api.kpis.getKPIs);
  const teams = useQuery(api.teams.getTeams);

  // Calculate summary metrics
  const totalObjectives = objectives?.length || 0;
  const avgObjectiveProgress = objectives?.reduce((acc, obj) => acc + obj.progress, 0) / totalObjectives || 0;
  const upcomingDeadlines = objectives?.filter(obj => 
    new Date(obj.endDate) > new Date() && 
    new Date(obj.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ) || [];

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Objectives</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObjectives}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Across {teams?.length || 0} teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgObjectiveProgress.toFixed(1)}%</div>
            <Progress value={avgObjectiveProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDeadlines.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Due within 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {objectives?.filter(obj => obj.progress < 25).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Less than 25% progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objectives?.slice(0, 5).map(objective => (
              <div key={objective._id} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{objective.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Due {formatDistanceToNow(new Date(objective.endDate), { addSuffix: true })}
                  </p>
                </div>
                <Progress value={objective.progress} className="w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams?.map(team => {
                const teamObjectives = objectives?.filter(obj => obj.teamId === team._id) || [];
                const avgProgress = teamObjectives.reduce((acc, obj) => acc + obj.progress, 0) / teamObjectives.length || 0;
                
                return (
                  <div key={team._id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{team.name}</span>
                      <span className="text-sm text-muted-foreground">{avgProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={avgProgress} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPI Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpis?.slice(0, 5).map(kpi => (
                <div key={kpi._id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{kpi.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {kpi.currentValue} / {kpi.targetValue}
                    </span>
                  </div>
                  <Progress value={(kpi.currentValue / kpi.targetValue) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}