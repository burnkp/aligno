"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Role } from "@/utils/permissions";
import { TeamMember } from "@/types/teams";

interface TeamInvitation {
  _id: Id<"invitations">;
  name: string;
  email: string;
  role: "org_admin" | "team_leader" | "team_member";
  status: "pending" | "accepted" | "expired" | "bounced";
}

interface TeamMembersProps {
  teamId: Id<"teams">;
  userRole: Role;
  members: TeamMember[];
  onInvite?: () => void;
}

export function TeamMembers({ teamId, userRole, members, onInvite }: TeamMembersProps) {
  const canInvite = userRole === "team_leader" || userRole === "org_admin" || userRole === "super_admin";
  const invitations = useQuery(api.teams.getTeamInvitations, { teamId }) as TeamInvitation[] | undefined;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Team Members</CardTitle>
        {canInvite && (
          <Button size="sm" onClick={onInvite}>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <Badge variant={member.role === "team_leader" ? "default" : "secondary"}>
                {member.role.replace("_", " ")}
              </Badge>
            </div>
          ))}

          {invitations?.map((invitation) => (
            <div key={invitation._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{invitation.name}</p>
                <p className="text-sm text-muted-foreground">{invitation.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {invitation.role.replace("_", " ")}
                </Badge>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 