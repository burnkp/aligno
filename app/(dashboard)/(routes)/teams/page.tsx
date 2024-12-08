"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TeamCard } from "@/components/teams/team-card";
import { Team } from "@/types/teams";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTeamModal } from "@/components/teams/create-team-modal";

export default function TeamsPage() {
  const teamsData = useQuery(api.teams.listUserTeams);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Loading state
  if (!teamsData) {
    return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const memberTeams = teamsData.memberTeams || [];
  const invitedTeams = (teamsData.invitedTeams || []).filter(Boolean) as Team[];
  const hasTeams = memberTeams.length > 0 || invitedTeams.length > 0;

  // No teams state
  if (!hasTeams) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teams</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Teams Yet</h2>
          <p className="text-gray-600">
            Create a new team or accept an invitation to get started.
          </p>
        </div>
        {showCreateModal && (
          <CreateTeamModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Teams</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {memberTeams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberTeams.map((team) => (
              <TeamCard
                key={team._id}
                id={team._id}
                name={team.name}
                description={team.description}
                members={team.members}
                isMember={true}
              />
            ))}
          </div>
        </div>
      )}

      {invitedTeams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Invitations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitedTeams.map((team) => (
              <TeamCard
                key={team._id}
                id={team._id}
                name={team.name}
                description={team.description}
                members={team.members}
                isMember={false}
              />
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}