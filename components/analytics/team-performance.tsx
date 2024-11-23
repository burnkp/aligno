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

interface TeamPerformanceProps {
  teams: Array<{
    _id: string;
    name: string;
  }>;
  objectives: Array<{
    _id: string;
    teamId: string;
    progress: number;
  }>;
  okrs: Array<{
    _id: string;
    teamId: string;
    progress: number;
  }>;
  kpis: Array<{
    _id: string;
    teamId: string;
    progress: number;
  }>;
}

export function TeamPerformance({ teams, objectives, okrs, kpis }: TeamPerformanceProps) {
  const data = teams.map(team => {
    const teamObjectives = objectives.filter(obj => obj.teamId === team._id);
    const teamOKRs = okrs.filter(okr => okr.teamId === team._id);
    const teamKPIs = kpis.filter(kpi => kpi.teamId === team._id);

    const avgObjectiveProgress = teamObjectives.length > 0
      ? teamObjectives.reduce((acc, obj) => acc + obj.progress, 0) / teamObjectives.length
      : 0;

    const avgOKRProgress = teamOKRs.length > 0
      ? teamOKRs.reduce((acc, okr) => acc + okr.progress, 0) / teamOKRs.length
      : 0;

    const avgKPIProgress = teamKPIs.length > 0
      ? teamKPIs.reduce((acc, kpi) => acc + kpi.progress, 0) / teamKPIs.length
      : 0;

    return {
      name: team.name,
      objectives: avgObjectiveProgress,
      okrs: avgOKRProgress,
      kpis: avgKPIProgress,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
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
                dataKey="objectives" 
                fill="hsl(var(--chart-1))" 
                name="Strategic Objectives"
                stackId="a"
              />
              <Bar 
                dataKey="okrs" 
                fill="hsl(var(--chart-2))" 
                name="OKRs"
                stackId="a"
              />
              <Bar 
                dataKey="kpis" 
                fill="hsl(var(--chart-3))" 
                name="KPIs"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}