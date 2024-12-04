"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamObjectives } from "@/components/teams/team-objectives";
import { TeamKPIs } from "@/components/teams/team-kpis";
import { TeamOKRs } from "@/components/teams/team-okrs";

export default function TeamDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "objectives";
  const teamId = params.teamId as string;
  
  const team = useQuery(api.teams.get, { teamId });
  const userAccess = useQuery(api.teams.getUserAccess, { teamId });

  if (!team || !userAccess) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{team.name}</h1>
        <div className="text-sm text-muted-foreground">
          Your Role: <span className="capitalize">{userAccess.role}</span>
        </div>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="objectives">Strategic Objectives</TabsTrigger>
          <TabsTrigger value="okrs">OKRs</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <TeamObjectives teamId={teamId} userRole={userAccess.role} />
        </TabsContent>

        <TabsContent value="okrs">
          <TeamOKRs teamId={teamId} userRole={userAccess.role} />
        </TabsContent>

        <TabsContent value="kpis">
          <TeamKPIs teamId={teamId} userRole={userAccess.role} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 