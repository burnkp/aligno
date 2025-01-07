"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Role } from "@/utils/permissions";

import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/kpi/kpi-card";
import { CreateKPIModal } from "@/components/kpi/create-kpi-modal";

interface OKR {
  _id: Id<"operationalKeyResults">;
  title: string;
  description: string;
  progress: number;
  startDate: string;
  endDate: string;
  teamId: Id<"teams">;
  strategicObjectiveId: Id<"strategicObjectives">;
}

interface Team {
  _id: Id<"teams">;
  name: string;
  description?: string;
  organizationId?: string;
  leaderId?: string;
  members: Array<{
    userId: string;
    role: "leader" | "member";
    joinedAt: string;
  }>;
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

export default function OKRDetailsPage() {
  const params = useParams();
  const okrId = params.okrId as Id<"operationalKeyResults">;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const rawOkrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, {
    strategicObjectiveId: undefined,
  });

  const okr = rawOkrs?.find((obj) => obj._id === okrId) as OKR | undefined;

  const teams = useQuery(api.teams.getTeams) as Team[] | undefined;
  const rawKpis = useQuery(api.kpis.getKPIs, {
    operationalKeyResultId: okrId,
    teamId: undefined,
    assignedTo: undefined,
  });

  const kpis = rawKpis?.map((kpi) => ({
    _id: kpi._id,
    title: kpi.title,
    description: kpi.description,
    currentValue: kpi.currentValue,
    targetValue: kpi.targetValue,
    progress: kpi.progress,
    startDate: kpi.startDate,
    endDate: kpi.endDate,
    teamId: kpi.teamId,
    assignedTo: kpi.assignedTo,
  })) as KPI[] | undefined;

  if (!okr) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{okr.title}</h1>
        <p className="text-muted-foreground">{okr.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Key Performance Indicators</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add KPI
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis?.map((kpi) => (
          <KPICard 
            key={kpi._id} 
            kpi={kpi}
            team={teams?.find(team => team._id === kpi.teamId)}
          />
        ))}
      </div>

      <CreateKPIModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        okrId={okrId}
      />
    </div>
  );
}