"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MilestoneForm } from "./MilestoneForm";
import { useToast } from "@/hooks/use-toast";

interface MilestoneTrackerProps {
  objectiveId: Id<"strategicObjectives">;
}

export function MilestoneTracker({ objectiveId }: MilestoneTrackerProps) {
  const { toast } = useToast();
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });
  const milestones = useQuery(api.strategicObjectives.getMilestones, {
    objectiveId,
  });
  const updateMilestoneStatus = useMutation(api.strategicObjectives.updateMilestoneStatus);
  const deleteMilestone = useMutation(api.strategicObjectives.deleteMilestone);
  const [isCreating, setIsCreating] = useState(false);

  if (!objective || !milestones) {
    return <div>Loading milestones...</div>;
  }

  const handleStatusUpdate = async (milestoneId: Id<"milestones">, status: "not_started" | "in_progress" | "completed" | "blocked") => {
    try {
      await updateMilestoneStatus({
        milestoneId,
        status,
      });
      toast({
        title: "Success",
        description: "Milestone status updated",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update milestone status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (milestoneId: Id<"milestones">) => {
    try {
      await deleteMilestone({
        milestoneId,
      });
      toast({
        title: "Success",
        description: "Milestone deleted",
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Milestones</CardTitle>
        <Button onClick={() => setIsCreating(true)} variant="outline" size="sm">
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent>
        {isCreating ? (
          <MilestoneForm
            objectiveId={objectiveId}
            onSuccess={() => setIsCreating(false)}
          />
        ) : milestones.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            No milestones yet
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{milestone.title}</h4>
                  <p className="text-sm text-gray-500">{milestone.description}</p>
                  <p className="text-xs text-gray-400">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={milestone.status}
                    onChange={(e) => handleStatusUpdate(milestone._id, e.target.value as any)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(milestone._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 