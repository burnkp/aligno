"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TeamOKRsProps {
  teamId: string;
  userRole: string;
}

export function TeamOKRs({ teamId, userRole }: TeamOKRsProps) {
  const okrs = useQuery(api.operationalKeyResults.getByTeam, { teamId });

  if (!okrs || okrs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No OKRs found for this team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {okrs.map((okr) => (
        <Card key={okr._id}>
          <CardHeader>
            <CardTitle>{okr.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{okr.description}</p>
            <div className="space-y-2">
              <Progress value={okr.progress} />
              <div className="flex justify-between text-sm">
                <span>Progress: {okr.progress}%</span>
                <span className="capitalize">Status: {okr.status}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <p>Start: {new Date(okr.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(okr.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 