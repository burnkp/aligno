"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ObjectivesListProps {
  objectives: any[];
  canEdit: boolean;
}

export function ObjectivesList({ objectives, canEdit }: ObjectivesListProps) {
  if (!objectives || objectives.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground">No objectives found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Strategic Objectives</h3>
      <div className="grid gap-4">
        {objectives.map((objective) => (
          <Card key={objective._id}>
            <CardHeader>
              <CardTitle className="text-base">{objective.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {objective.description}
              </p>
              <Progress value={objective.progress} className="h-2" />
              <div className="flex justify-between mt-2 text-sm">
                <span>{objective.progress}% complete</span>
                <span>
                  {new Date(objective.startDate).toLocaleDateString()} -{" "}
                  {new Date(objective.endDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 