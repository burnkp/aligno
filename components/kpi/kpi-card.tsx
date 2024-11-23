"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { UpdateKPIModal } from "./update-kpi-modal";

interface KPICardProps {
  kpi: {
    _id: string;
    title: string;
    description: string;
    currentValue: number;
    targetValue: number;
    progress: number;
    startDate: string;
    endDate: string;
    teamId: string;
    assignedTo: string;
  };
  team?: {
    name: string;
  };
}

export function KPICard({ kpi, team }: KPICardProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const timeLeft = formatDistanceToNow(new Date(kpi.endDate), { addSuffix: true });

  return (
    <>
      <Card className="hover:shadow-lg transition">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{kpi.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {kpi.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{team?.name || "Loading..."}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{kpi.progress.toFixed(1)}%</span>
              </div>
              <Progress value={kpi.progress} />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Value</span>
              <span className="font-medium">{kpi.currentValue}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Target Value</span>
              <span className="font-medium">{kpi.targetValue}</span>
            </div>

            <div className="text-xs text-muted-foreground">
              Due {timeLeft}
            </div>
          </div>
        </CardContent>
      </Card>

      <UpdateKPIModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        kpi={kpi}
      />
    </>
  );
}