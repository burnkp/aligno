"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { CreateObjectiveModal } from "@/components/objectives/create-objective-modal";

interface Objective {
  _id: Id<"strategicObjectives">;
  title: string;
  description: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  startDate: string;
  endDate: string;
  teamId: Id<"teams">;
}

interface TeamObjectivesListProps {
  objectives: Objective[];
  teamId: Id<"teams">;
  canEdit: boolean;
}

export function TeamObjectivesList({ objectives, teamId, canEdit }: TeamObjectivesListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: Objective["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Strategic Objectives</CardTitle>
        {canEdit && (
          <Button onClick={() => setShowCreateModal(true)}>
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
                <Badge className={getStatusColor(objective.status)}>
                  {objective.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{objective.progress}%</span>
                </div>
                <Progress value={objective.progress} />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Start: {new Date(objective.startDate).toLocaleDateString()}</span>
                <span>End: {new Date(objective.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CreateObjectiveModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        teamId={teamId}
      />
    </Card>
  );
} 