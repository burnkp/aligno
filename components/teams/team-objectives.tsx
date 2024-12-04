"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TeamObjectivesProps {
  teamId: string;
  userRole: string;
}

export function TeamObjectives({ teamId, userRole }: TeamObjectivesProps) {
  const objectives = useQuery(api.strategicObjectives.getByTeam, { teamId });

  if (!objectives || objectives.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No strategic objectives found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {objectives.map((objective) => (
        <Card key={objective._id}>
          <CardHeader>
            <CardTitle>{objective.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{objective.description}</p>
            <div className="space-y-2">
              <Progress value={objective.progress} />
              <div className="flex justify-between text-sm">
                <span>Progress: {objective.progress}%</span>
                <span className="capitalize">Status: {objective.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 