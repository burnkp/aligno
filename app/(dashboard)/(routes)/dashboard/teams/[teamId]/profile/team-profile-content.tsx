"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRole } from "@/utils/permissions";
import { Id } from "@/convex/_generated/dataModel";
import { Team } from "@/types/teams";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TeamInvitation {
  _id: Id<"invitations">;
  name: string;
  email: string;
  role: "org_admin" | "team_leader" | "team_member";
  status: "pending" | "accepted" | "expired" | "bounced";
}

interface TeamWithData extends Team {
  objectives: Array<{
    _id: Id<any>;
    title: string;
    description: string;
    progress: number;
    startDate: string;
    endDate: string;
    status: string;
  }>;
  kpis: Array<{
    _id: Id<any>;
    title: string;
    description: string;
    targetValue: number;
    currentValue: number;
    progress: number;
    status: string;
  }>;
}

interface TeamProfileContentProps {
  teamId: Id<"teams">;
}

export default function TeamProfileContent({ teamId }: TeamProfileContentProps) {
  const { user } = useUser();
  const team = useQuery(api.teams.getTeamWithData, { teamId });
  const invitations = useQuery(api.teams.getTeamInvitations, { teamId }) as TeamInvitation[] | undefined;

  if (!user) {
    redirect("/sign-in");
  }

  if (!team) {
    return <div>Loading...</div>;
  }

  const userRole = getUserRole(user.id, team);
  const isTeamLeaderOrHigher = userRole === "team_leader" || userRole === "org_admin" || userRole === "super_admin";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Profile</CardTitle>
          <CardDescription>
            View and manage team information, objectives, and KPIs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Team Name</h3>
              <p>{team.name}</p>
            </div>
            {team.description && (
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p>{team.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium">Members</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {team.members.map((member) => (
                  <Badge
                    key={member.userId}
                    variant={member.role === "team_leader" ? "default" : "secondary"}
                  >
                    {member.name} ({member.role.replace("_", " ")})
                  </Badge>
                ))}
                {invitations?.map((invitation) => (
                  <Badge
                    key={invitation._id}
                    variant="outline"
                  >
                    {invitation.name} ({invitation.role.replace("_", " ")}) - Pending
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {team.objectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Strategic Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.objectives.map((objective) => (
                <div key={objective._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{objective.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {objective.description}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(objective.startDate).toLocaleDateString()} - {new Date(objective.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{objective.progress}%</span>
                    </div>
                    <Progress value={objective.progress} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {team.kpis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.kpis.map((kpi) => (
                <div key={kpi._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{kpi.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {kpi.description}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: {kpi.currentValue} / Target: {kpi.targetValue}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{kpi.progress}%</span>
                    </div>
                    <Progress value={kpi.progress} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isTeamLeaderOrHigher && (
        <div className="flex justify-end space-x-4">
          <Button asChild>
            <Link href={`/dashboard/teams/${teamId}/settings`}>
              Team Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/teams/${teamId}/members`}>
              Manage Members
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
} 