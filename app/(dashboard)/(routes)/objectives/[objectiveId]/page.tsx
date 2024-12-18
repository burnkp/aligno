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

interface Objective {
  _id: Id<"strategicObjectives">;
  title: string;
  description: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  startDate: string;
  endDate: string;
  teamId: Id<"teams">;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Team {
  _id: Id<"teams">;
  name: string;
  description?: string;
  organizationId: Id<"organizations">;
  leaderId: string;
  members: Array<{
    userId: string;
    email: string;
    name: string;
    role: "leader" | "member" | "admin";
    joinedAt: string;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function ObjectiveDetailsPage() {
  const params = useParams();
  const objectiveId = params.objectiveId as Id<"strategicObjectives">;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });

  const teams = useQuery(api.teams.getTeams) as Team[] | undefined;
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, {
    strategicObjectiveId: objectiveId,
  });

  if (!objective || !teams || !okrs) {
    return <div>Loading...</div>;
  }

  // Transform teams to match the CreateOKRModal's expected format
  const simplifiedTeams = teams.map(team => ({
    _id: team._id,
    name: team.name,
  }));

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
        {okrs.map((okr) => (
          <OKRCard 
            key={okr._id} 
            okr={okr}
            team={teams.find(team => team._id === okr.teamId)}
          />
        ))}
      </div>

      <CreateOKRModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        teams={simplifiedTeams}
        objectiveId={objectiveId}
      />
    </div>
  );
}