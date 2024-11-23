"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverallProgressProps {
  objectives: Array<{
    _id: string;
    title: string;
    progress: number;
  }>;
  okrs: Array<{
    _id: string;
    title: string;
    progress: number;
  }>;
  kpis: Array<{
    _id: string;
    title: string;
    progress: number;
  }>;
}

export function OverallProgress({ objectives, okrs, kpis }: OverallProgressProps) {
  const avgObjectiveProgress = objectives.length > 0
    ? objectives.reduce((acc, obj) => acc + obj.progress, 0) / objectives.length
    : 0;

  const avgOKRProgress = okrs.length > 0
    ? okrs.reduce((acc, okr) => acc + okr.progress, 0) / okrs.length
    : 0;

  const avgKPIProgress = kpis.length > 0
    ? kpis.reduce((acc, kpi) => acc + kpi.progress, 0) / kpis.length
    : 0;

  const data = [
    {
      name: "Strategic Objectives",
      progress: avgObjectiveProgress,
    },
    {
      name: "OKRs",
      progress: avgOKRProgress,
    },
    {
      name: "KPIs",
      progress: avgKPIProgress,
    },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Progress"]}
              />
              <Legend />
              <Bar 
                dataKey="progress" 
                fill="hsl(var(--chart-1))"
                name="Progress (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}