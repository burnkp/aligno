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
  Legend,
} from "recharts";
import { format } from "date-fns";

interface ProgressHistoryProps {
  objectiveId: Id<"strategicObjectives">;
}

interface ProgressPoint {
  date: string;
  progress: number;
}

export const ProgressHistory = ({ objectiveId }: ProgressHistoryProps) => {
  // Get the objective and its history
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const objective = objectives?.find(obj => obj._id === objectiveId);

  if (!objective) {
    return <div>Loading progress history...</div>;
  }

  // For now, generate sample historical data (replace with actual history from database)
  const generateHistoricalData = (): ProgressPoint[] => {
    const startDate = new Date(objective.startDate);
    const now = new Date();
    const points: ProgressPoint[] = [];
    let currentProgress = 0;

    // Generate points up to current date
    while (currentProgress < objective.progress) {
      points.push({
        date: format(startDate, "MMM d"),
        progress: currentProgress,
      });

      // Simulate progress increments
      currentProgress += Math.random() * 10;
      startDate.setDate(startDate.getDate() + 7); // Weekly points

      if (startDate > now) break;
    }

    // Add current progress point
    points.push({
      date: format(now, "MMM d"),
      progress: objective.progress,
    });

    return points;
  };

  const historyData = generateHistoricalData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress History</CardTitle>
        <CardDescription>
          Historical progress tracking over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval={Math.floor(historyData.length / 10)}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#2563eb"
                name="Progress"
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