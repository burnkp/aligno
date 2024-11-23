"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { OKRCard } from "@/components/okr/okr-card";
import { CreateOKRModal } from "@/components/okr/create-okr-modal";

export default function ObjectiveDetailsPage() {
  const params = useParams();
  const objectiveId = params.objectiveId as Id<"strategicObjectives">;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const objective = useQuery(api.strategicObjectives.getStrategicObjectives)?.find(
    (obj) => obj._id === objectiveId
  );
  const teams = useQuery(api.teams.getTeams);
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, {
    strategicObjectiveId: objectiveId,
  });

  if (!objective) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{objective.title}</h1>
        <p className="text-muted-foreground">{objective.description}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Operational Key Results</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Key Result
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {okrs?.map((okr) => (
          <OKRCard 
            key={okr._id} 
            okr={okr}
            team={teams?.find(team => team._id === okr.teamId)}
          />
        ))}
      </div>

      <CreateOKRModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        teams={teams || []}
        objectiveId={objectiveId}
      />
    </div>
  );
}