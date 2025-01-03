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
import { useEffect } from "react";

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
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect("/sign-in");
    }
  }, [isLoaded, isSignedIn]);

  const teamData = useQuery(api.teams.getTeamWithData, { teamId });

  if (!teamData) {
    return <div>Loading...</div>;
  }

  const { objectives, kpis, ...team } = teamData;
  const userRole = user ? getUserRole(user.id, teamData) : null;

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          {team.description && (
            <p className="text-muted-foreground mt-2">{team.description}</p>
          )}
        </div>
        {userRole === "admin" && (
          <Button asChild>
            <Link href={`/dashboard/teams/${teamId}/settings`}>
              Team Settings
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {team.members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <Badge>{member.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives.map((objective) => (
                <div key={objective._id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{objective.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Progress: {Math.round(objective.progress)}%
                    </p>
                  </div>
                  <Badge>{objective.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpis.map((kpi) => (
                <div key={kpi._id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{kpi.title}</p>
                    <Badge>{kpi.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Target: {kpi.targetValue}</span>
                    <span>Current: {kpi.currentValue}</span>
                  </div>
                  <Progress value={kpi.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 