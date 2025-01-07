"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { Role } from "@/utils/permissions";

interface TeamKPIsProps {
  teamId: Id<"teams">;
  userRole: Role;
}

export function TeamKPIs({ teamId, userRole }: TeamKPIsProps) {
  const allKPIs = useQuery(api.kpis.getKPIs, {});
  const kpis = allKPIs?.filter(kpi => kpi.teamId === teamId);

  const canEdit = userRole === "team_leader" || userRole === "org_admin" || userRole === "super_admin";

  if (!kpis || kpis.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No key performance indicators found for this team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Key Performance Indicators</CardTitle>
        {canEdit && (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add KPI
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{kpi.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {kpi.description}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Current: {kpi.currentValue} / Target: {kpi.targetValue}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{kpi.progress}%</span>
                </div>
                <Progress value={kpi.progress} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 