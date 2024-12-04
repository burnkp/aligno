"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Check, X } from "lucide-react";
import { MilestoneForm } from "./MilestoneForm";
import { formatDistance } from "date-fns";

interface MilestoneTrackerProps {
  objectiveId: string;
}

export const MilestoneTracker = ({ objectiveId }: MilestoneTrackerProps) => {
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });
  const [isCreating, setIsCreating] = useState(false);
  const updateMilestone = useMutation(api.strategicObjectives.updateMilestone);

  if (!objective) {
    return <div>Loading milestone tracker...</div>;
  }

  const milestones = objective.milestones || [];
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const progress = milestones.length
    ? (completedMilestones / milestones.length) * 100
    : 0;

  const toggleMilestone = async (milestoneId: string) => {
    const milestone = milestones.find((m) => m._id === milestoneId);
    if (milestone) {
      await updateMilestone({
        objectiveId,
        milestoneId,
        completed: !milestone.completed,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>
              {completedMilestones} of {milestones.length} completed
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} />

          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div
                key={milestone._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
              >
                <div className="space-y-1">
                  <div className="font-medium">{milestone.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Due{" "}
                    {formatDistance(new Date(milestone.dueDate), new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <Button
                  variant={milestone.completed ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleMilestone(milestone._id)}
                >
                  {milestone.completed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          {isCreating && (
            <MilestoneForm
              objectiveId={objectiveId}
              onClose={() => setIsCreating(false)}
              onSuccess={() => setIsCreating(false)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 