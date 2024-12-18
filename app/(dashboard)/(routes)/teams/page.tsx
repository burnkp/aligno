"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/teams/team-card";
import { CreateTeamModal } from "@/components/teams/create-team-modal";
import { InviteMemberModal } from "@/components/teams/invite-member-modal";

interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: "leader" | "member" | "admin";
  joinedAt: string;
}

interface Team {
  _id: Id<"teams">;
  name: string;
  description?: string;
  organizationId: Id<"organizations">;
  leaderId: string;
  members: TeamMember[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamsPage() {
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<Id<"teams"> | null>(null);

  const teams = useQuery(api.teams.getTeams) as Team[] | undefined;

  if (!user || !teams) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard
            key={team._id}
            id={team._id}
            name={team.name}
            description={team.description}
            members={team.members}
            onInvite={() => setSelectedTeamId(team._id)}
          />
        ))}
      </div>

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedTeamId && (
        <InviteMemberModal
          isOpen={!!selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          teamId={selectedTeamId}
        />
      )}
    </div>
  );
}