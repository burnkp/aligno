"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Edit2 } from "lucide-react";
import { EditKPIModal } from "./edit-kpi-modal";
import { useState } from "react";

interface TeamKPIsProps {
  teamId: string;
  userRole: string;
}

export function TeamKPIs({ teamId, userRole }: TeamKPIsProps) {
  const kpis = useQuery(api.kpis.getByTeam, { teamId });
  const [selectedKPI, setSelectedKPI] = useState<any | null>(null);
  const { toast } = useToast();

  const handleEdit = (kpi: any) => {
    setSelectedKPI(kpi);
  };

  if (!kpis || kpis.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No KPIs found for this team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {kpis.map((kpi) => (
          <Card key={kpi._id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{kpi.title}</CardTitle>
              {userRole !== "member" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(kpi)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{kpi.description}</p>
              <div className="space-y-2">
                <Progress value={kpi.progress} />
                <div className="flex justify-between text-sm">
                  <span>Current: {kpi.currentValue}</span>
                  <span>Target: {kpi.targetValue}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  <p>Last Updated: {new Date(kpi.lastUpdated).toLocaleDateString()}</p>
                  <p>Assigned to: {kpi.assignedTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedKPI && (
        <EditKPIModal
          kpi={selectedKPI}
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </>
  );
} 