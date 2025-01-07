"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { TeamMembersList } from "@/components/profile/team-members-list";
import { KPIsList } from "@/components/profile/kpis-list";
import { TeamObjectivesList } from "@/components/profile/team-objectives-list";

interface TeamDashboardProps {
  teamId: Id<"teams">;
}

export function TeamDashboard({ teamId }: TeamDashboardProps) {
  const teamData = useQuery(api.teams.getTeamWithData, { teamId });
  const allObjectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!teamData || !allObjectives) {
    return <div>Loading...</div>;
  }

  const objectives = allObjectives.filter(obj => obj.teamId === teamId);
  const userRole = teamData.members.find(m => m.userId === teamData.leaderId)?.role || "team_member";
  const canInvite = userRole === "org_admin" || userRole === "team_leader";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{teamData.name}</h1>
          {teamData.description && (
            <p className="text-muted-foreground mt-2">{teamData.description}</p>
          )}
        </div>
        {canInvite && (
          <Button onClick={() => setShowInviteModal(true)}>
            Invite Member
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Objectives Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {objectives.filter(obj => obj.status === "completed").length} / {objectives.length} Complete
                  </span>
                </div>
                <Progress 
                  value={objectives.length > 0 
                    ? (objectives.filter(obj => obj.status === "completed").length / objectives.length) * 100 
                    : 0
                  } 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <TeamMembersList 
          members={teamData.members}
          canManage={canInvite}
          teamId={teamId}
        />
      </div>

      <TeamObjectivesList 
        objectives={objectives}
        teamId={teamId}
        canEdit={canInvite}
      />

      <KPIsList objectiveId={objectives[0]?._id} />

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamId={teamId}
      />
    </div>
  );
} 