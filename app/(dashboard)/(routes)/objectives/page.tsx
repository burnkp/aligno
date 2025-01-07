"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateObjectiveModal } from "@/components/objectives/create-objective-modal";
import { TeamObjectivesList } from "@/components/profile/team-objectives-list";
import { Role } from "@/utils/permissions";

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
    role: Role;
    joinedAt: string;
  }>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function ObjectivesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<Id<"teams"> | null>(null);
  
  const teams = useQuery(api.teams.getTeams) as Team[] | undefined;
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);

  if (!teams || !objectives) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Strategic Objectives</h1>
        <Button onClick={() => {
          if (teams.length > 0) {
            setSelectedTeamId(teams[0]._id);
            setIsCreateModalOpen(true);
          }
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Objective
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {teams.map((team) => (
          <TeamObjectivesList
            key={team._id}
            objectives={objectives.filter(obj => obj.teamId === team._id)}
            teamId={team._id}
            canEdit={true}
          />
        ))}
      </div>

      {selectedTeamId && (
        <CreateObjectiveModal 
          isOpen={isCreateModalOpen} 
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedTeamId(null);
          }}
          teamId={selectedTeamId}
        />
      )}
    </div>
  );
}