"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ObjectivesList } from "./objectives-list";
import { KPIsList } from "./kpis-list";
import { InviteMemberModal } from "../teams/invite-member-modal";
import { useState } from "react";

interface TeamDashboardProps {
  teamId: string;
}

export function TeamDashboard({ teamId }: TeamDashboardProps) {
  const teamData = useQuery(api.teams.getTeamWithObjectives, { teamId });
  const userRole = useQuery(api.teams.getUserRole, { teamId });
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!teamData || userRole === undefined) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const canInviteMembers = userRole === "admin" || userRole === "leader";

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{teamData.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-muted-foreground">
                Role: {userRole}
              </span>
              {canInviteMembers && (
                <Button
                  size="sm"
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ObjectivesList 
            objectives={teamData.objectives} 
            canEdit={userRole === "leader"} 
          />
          <KPIsList 
            kpis={teamData.kpis} 
            canEdit={userRole === "leader" || userRole === "member"} 
          />
        </CardContent>
      </Card>

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamId={teamId}
      />
    </>
  );
} 