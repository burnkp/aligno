"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { EditKPIModal } from "./edit-kpi-modal";
import { Plus } from "lucide-react";

interface TeamKPIsProps {
  teamId: Id<"teams">;
  userRole: "leader" | "member" | "admin";
}

export function TeamKPIs({ teamId, userRole }: TeamKPIsProps) {
  const kpis = useQuery(api.kpis.getKPIs, { teamId });
  const [selectedKPI, setSelectedKPI] = useState<any | null>(null);
  const { toast } = useToast();

  const canEdit = userRole === "leader" || userRole === "admin";

  if (!kpis) {
    return <div>Loading...</div>;
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
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedKPI(kpi)}
                  >
                    Update
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{kpi.progress}%</span>
                </div>
                <Progress value={kpi.progress} />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Current: {kpi.currentValue}</span>
                <span>Target: {kpi.targetValue}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {selectedKPI && (
        <EditKPIModal
          kpi={selectedKPI}
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </Card>
  );
} 