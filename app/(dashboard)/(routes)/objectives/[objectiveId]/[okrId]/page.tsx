"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/kpi/kpi-card";
import { CreateKPIModal } from "@/components/kpi/create-kpi-modal";

export default function OKRDetailsPage() {
  const params = useParams();
  const okrId = params.okrId as Id<"operationalKeyResults">;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const okr = useQuery(api.operationalKeyResults.getOperationalKeyResults)?.find(
    (obj) => obj._id === okrId
  );
  const teams = useQuery(api.teams.getTeams);
  const kpis = useQuery(api.kpis.getKPIs, {
    operationalKeyResultId: okrId,
  });

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
        teams={teams || []}
        okrId={okrId}
      />
    </div>
  );
}