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
import { format, addDays } from "date-fns";

interface PredictiveAnalyticsProps {
  objectiveId: Id<"strategicObjectives">;
}

interface Prediction {
  date: string;
  predicted: number;
  actual?: number;
}

export const PredictiveAnalytics = ({ objectiveId }: PredictiveAnalyticsProps) => {
  // Get the objective and its KPIs
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const objective = objectives?.find(obj => obj._id === objectiveId);

  if (!objective) {
    return <div>Loading predictive analytics...</div>;
  }

  // Generate sample prediction data (replace with actual ML predictions)
  const generatePredictions = (): Prediction[] => {
    const predictions: Prediction[] = [];
    const startDate = new Date(objective.startDate);
    const endDate = new Date(objective.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= totalDays; i++) {
      const date = addDays(startDate, i);
      const progress = i / totalDays * 100;
      const randomVariation = Math.random() * 10 - 5; // Random variation between -5 and 5
      
      predictions.push({
        date: format(date, "MMM d"),
        predicted: Math.min(100, Math.max(0, progress + randomVariation)),
        actual: date <= new Date() ? objective.progress : undefined,
      });
    }
    
    return predictions;
  };

  const predictions = generatePredictions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
        <CardDescription>
          Projected progress based on historical data and current trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval={Math.floor(predictions.length / 10)}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#2563eb"
                name="Predicted Progress"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                name="Actual Progress"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 