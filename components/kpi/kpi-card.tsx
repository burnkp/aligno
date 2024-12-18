"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { UpdateKPIModal } from "./update-kpi-modal";
import { Id } from "@/convex/_generated/dataModel";

interface Team {
  _id: Id<"teams">;
  name: string;
}

interface KPI {
  _id: Id<"kpis">;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  progress: number;
  startDate: string;
  endDate: string;
  teamId: Id<"teams">;
  assignedTo: string;
}

interface KPICardProps {
  kpi: KPI;
  team?: Team;
}

export const KPICard = ({ kpi, team }: KPICardProps) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">{kpi.title}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              Update
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{kpi.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(kpi.progress)}%</span>
            </div>
            <Progress
              value={kpi.progress}
              className={getProgressColor(kpi.progress)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Current Value</p>
              <p className="font-medium">{kpi.currentValue}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Target Value</p>
              <p className="font-medium">{kpi.targetValue}</p>
            </div>
          </div>

          {team && (
            <div className="text-sm">
              <p className="text-muted-foreground">Team</p>
              <p className="font-medium">{team.name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateKPIModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        kpi={kpi}
      />
    </>
  );
};