"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TeamCard } from "@/components/teams/team-card";
import { Team } from "@/types/teams";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamsPage() {
  const teamsData = useQuery(api.teams.list);

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
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Teams Yet</h2>
          <p className="text-gray-600">
            You haven't joined any teams yet. Accept an invitation to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
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
    </div>
  );
}