"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { Role } from "@/utils/permissions";

interface TeamObjectivesProps {
  teamId: Id<"teams">;
  userRole: Role;
}

export function TeamObjectives({ teamId, userRole }: TeamObjectivesProps) {
  const allObjectives = useQuery(api.strategicObjectives.getStrategicObjectives, {});
  const objectives = allObjectives?.filter(obj => obj.teamId === teamId);

  const canEdit = userRole === "team_leader" || userRole === "org_admin" || userRole === "super_admin";

  if (!objectives || objectives.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No strategic objectives found for this team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Strategic Objectives</CardTitle>
        {canEdit && (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {objectives.map((objective) => (
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
  );
} 