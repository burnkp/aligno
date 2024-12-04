"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { StrategicObjective, Milestone } from "@/lib/types";

interface ProgressHistoryProps {
  objectiveId: Id<"strategicObjectives">;
}

interface ProgressPoint {
  date: string;
  progress: number;
  milestonesCompleted: number;
}

export const ProgressHistory = ({ objectiveId }: ProgressHistoryProps) => {
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });

  if (!objective) {
    return <div>Loading progress history...</div>;
  }

  // Generate progress history from milestones
  const progressHistory: ProgressPoint[] = objective.milestones
    .filter((m: Milestone) => m.completed)
    .sort((a: Milestone, b: Milestone) => 
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    )
    .reduce((acc: ProgressPoint[], milestone: Milestone, index: number) => {
      const totalWeight = objective.milestones.reduce(
        (sum: number, m: Milestone) => sum + m.weight,
        0
      );
      const completedWeight = objective.milestones
        .filter(
          (m: Milestone) =>
            m.completed &&
            new Date(m.updatedAt) <= new Date(milestone.updatedAt)
        )
        .reduce((sum: number, m: Milestone) => sum + m.weight, 0);

      const progress = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;

      return [
        ...acc,
        {
          date: milestone.updatedAt,
          progress: Math.round(progress),
          milestonesCompleted: index + 1,
        },
      ];
    }, []);

  // Add initial point
  if (progressHistory.length > 0) {
    progressHistory.unshift({
      date: objective.startDate,
      progress: 0,
      milestonesCompleted: 0,
    });
  }

  // Add current point if not complete
  const isComplete = objective.progress === 100;
  if (!isComplete) {
    progressHistory.push({
      date: new Date().toISOString(),
      progress: objective.progress,
      milestonesCompleted: objective.milestones.filter((m: Milestone) => m.completed).length,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress History</CardTitle>
        <CardDescription>
          Track objective progress over time based on completed milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                labelFormatter={(date) =>
                  format(new Date(date as string), "MMM d, yyyy")
                }
                formatter={(value, name) => {
                  if (name === "progress") return [`${value}%`, "Progress"];
                  return [value, "Milestones Completed"];
                }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="milestonesCompleted"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 