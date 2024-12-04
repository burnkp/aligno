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
import { format, addDays, differenceInDays } from "date-fns";
import { Milestone } from "@/lib/types";

interface PredictiveAnalyticsProps {
  objectiveId: Id<"strategicObjectives">;
}

interface DataPoint {
  date: string;
  actual: number;
  predicted: number | null;
}

export const PredictiveAnalytics = ({ objectiveId }: PredictiveAnalyticsProps) => {
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });

  if (!objective) {
    return <div>Loading predictive analytics...</div>;
  }

  const completedMilestones = objective.milestones.filter(
    (m: Milestone) => m.completed
  );

  // Generate historical data points
  const historicalData: DataPoint[] = completedMilestones
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    .map((milestone) => ({
      date: milestone.updatedAt,
      actual: objective.progress,
      predicted: null,
    }));

  // Add initial point
  if (historicalData.length > 0) {
    historicalData.unshift({
      date: objective.startDate,
      actual: 0,
      predicted: null,
    });
  }

  // Calculate trend line for prediction
  if (historicalData.length >= 2) {
    const firstPoint = historicalData[0];
    const lastPoint = historicalData[historicalData.length - 1];
    const totalDays = differenceInDays(
      new Date(lastPoint.date),
      new Date(firstPoint.date)
    );
    const progressPerDay =
      (lastPoint.actual - firstPoint.actual) / Math.max(totalDays, 1);

    // Project trend line to end date
    const daysToEnd = differenceInDays(
      new Date(objective.endDate),
      new Date(lastPoint.date)
    );
    const projectedProgress = Math.min(
      lastPoint.actual + progressPerDay * daysToEnd,
      100
    );

    // Add prediction points
    const predictionPoints: DataPoint[] = [];
    for (let i = 1; i <= 5; i++) {
      const daysAhead = Math.floor((daysToEnd * i) / 5);
      const date = addDays(new Date(lastPoint.date), daysAhead);
      const predicted = Math.min(
        lastPoint.actual + progressPerDay * daysAhead,
        100
      );
      predictionPoints.push({
        date: date.toISOString(),
        actual: lastPoint.actual,
        predicted: Math.round(predicted),
      });
    }

    // Add final prediction point
    predictionPoints.push({
      date: objective.endDate,
      actual: lastPoint.actual,
      predicted: Math.round(projectedProgress),
    });

    // Combine historical and prediction data
    const allData = [...historicalData, ...predictionPoints];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Prediction</CardTitle>
          <CardDescription>
            Projected progress based on historical completion rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={allData}>
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
                  formatter={(value: number) => [`${value}%`, "Progress"]}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#16a34a"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Prediction</CardTitle>
        <CardDescription>
          Not enough data points to generate prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full flex items-center justify-center text-gray-500">
          Complete more milestones to see progress prediction
        </div>
      </CardContent>
    </Card>
  );
}; 