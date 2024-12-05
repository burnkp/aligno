"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

interface PageProps {
  params: {
    teamId: Id<"teams">;
  };
}

const TeamProfilePage = ({ params }: PageProps) => {
  const { user } = useUser();
  const team = useQuery(api.teams.getTeamWithData, { 
    teamId: params.teamId 
  });

  if (!team) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find current user's role in the team
  const currentMember = team.team.members.find(member => member.userId === user?.id);
  const userRole = currentMember?.role || "member";

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Team Info */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to {team.team.name}</CardTitle>
          <CardDescription>
            You are a {userRole} of this team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {team.team.description && (
            <p className="text-muted-foreground">{team.team.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Strategic Objectives */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Strategic Objectives</CardTitle>
            <CardDescription>
              Track your team's strategic objectives and progress
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/objectives/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Objective
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {team.objectives.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No strategic objectives set yet. Click the button above to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {team.objectives.map((objective) => (
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
          )}
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>
              Monitor your team's KPIs and metrics
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/kpis/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add KPI
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {team.kpis.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No KPIs defined yet. Click the button above to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {team.kpis.map((kpi) => (
                <Card key={kpi._id}>
                  <CardHeader>
                    <CardTitle>{kpi.title}</CardTitle>
                    <CardDescription>{kpi.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span>Current: {kpi.currentValue} / Target: {kpi.targetValue}</span>
                      <span>Progress: {kpi.progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamProfilePage; 