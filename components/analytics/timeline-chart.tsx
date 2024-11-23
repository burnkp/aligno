"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfMonth, format } from "date-fns";

interface TimelineChartProps {
  objectives: Array<{
    _id: string;
    progress: number;
    startDate: string;
  }>;
  okrs: Array<{
    _id: string;
    progress: number;
    startDate: string;
  }>;
  kpis: Array<{
    _id: string;
    progress: number;
    startDate: string;
  }>;
}

export function TimelineChart({ objectives, okrs, kpis }: TimelineChartProps) {
  const allDates = [...objectives, ...okrs, ...kpis].map(
    item => startOfMonth(new Date(item.startDate))
  );
  const uniqueDates = Array.from(new Set(allDates)).sort((a, b) => a.getTime() - b.getTime());

  const data = uniqueDates.map(date => {
    const monthObjectives = objectives.filter(
      obj => startOfMonth(new Date(obj.startDate)).getTime() === date.getTime()
    );
    const monthOKRs = okrs.filter(
      okr => startOfMonth(new Date(okr.startDate)).getTime() === date.getTime()
    );
    const monthKPIs = kpis.filter(
      kpi => startOfMonth(new Date(kpi.startDate)).getTime() === date.getTime()
    );

    const avgObjectiveProgress = monthObjectives.length > 0
      ? monthObjectives.reduce((acc, obj) => acc + obj.progress, 0) / monthObjectives.length
      : 0;

    const avgOKRProgress = monthOKRs.length > 0
      ? monthOKRs.reduce((acc, okr) => acc + okr.progress, 0) / monthOKRs.length
      : 0;

    const avgKPIProgress = monthKPIs.length > 0
      ? monthKPIs.reduce((acc, kpi) => acc + kpi.progress, 0) / monthKPIs.length
      : 0;

    return {
      date: format(date, "MMM yyyy"),
      objectives: avgObjectiveProgress,
      okrs: avgOKRProgress,
      kpis: avgKPIProgress,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Progress Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Progress"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="objectives"
                stroke="hsl(var(--chart-1))"
                name="Strategic Objectives"
              />
              <Line
                type="monotone"
                dataKey="okrs"
                stroke="hsl(var(--chart-2))"
                name="OKRs"
              />
              <Line
                type="monotone"
                dataKey="kpis"
                stroke="hsl(var(--chart-3))"
                name="KPIs"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}