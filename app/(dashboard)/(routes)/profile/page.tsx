"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { TeamDashboard } from "@/components/profile/team-dashboard";
import { EmptyState } from "@/components/ui/empty-state";
import { Id } from "@/convex/_generated/dataModel";
import { Role } from "@/utils/permissions";

interface Team {
  _id: Id<any>;
  name: string;
  description?: string;
  organizationId?: string;
  leaderId?: string;
  members: Array<{
    userId: string;
    role: Role;
    joinedAt: string;
  }>;
}

export default function ProfilePage() {
  const { user } = useUser();
  const teams = useQuery(api.teams.getTeams) as Team[] | undefined;

  if (!teams || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Filter teams to only show those where the user is a member
  const userTeams = teams.filter(team => 
    team.members.some(member => member.userId === user.id)
  );

  if (userTeams.length === 0) {
    return (
      <EmptyState
        title="No Teams Found"
        description="You are not currently a member of any teams."
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {userTeams.map((team) => (
        <TeamDashboard key={team._id} teamId={team._id} />
      ))}
    </div>
  );
} 