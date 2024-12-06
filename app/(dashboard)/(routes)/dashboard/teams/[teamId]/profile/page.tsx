"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRole } from "@/utils/permissions";

interface Props {
  params: {
    teamId: string;
  };
}

export default function TeamProfilePage({ params }: Props) {
  const { user } = useUser();
  const teamData = useQuery(api.teams.getTeamWithData, {
    teamId: params.teamId as any,
  });

  if (!teamData || !user) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  const { objectives, kpis, ...team } = teamData;
  const userRole = getUserRole(team, user.id);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to {team.name}</CardTitle>
          <CardDescription>
            You are a {userRole} of this team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {team.description && (
            <p className="text-muted-foreground">{team.description}</p>
          )}
        </CardContent>
      </Card>

      {objectives.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Strategic Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective) => (
              <Card key={objective._id}>
                <CardHeader>
                  <CardTitle>{objective.title}</CardTitle>
                  <CardDescription>{objective.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span>Progress: {objective.progress}%</span>
                    <span>{objective.startDate} - {objective.endDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {kpis.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kpis.map((kpi) => (
              <Card key={kpi._id}>
                <CardHeader>
                  <CardTitle>{kpi.title}</CardTitle>
                  <CardDescription>{kpi.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span>Target: {kpi.target}</span>
                    <span>Current: {kpi.current}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 