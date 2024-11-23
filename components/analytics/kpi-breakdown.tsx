"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIBreakdownProps {
  teams: Array<{
    _id: string;
    name: string;
  }>;
  kpis: Array<{
    _id: string;
    teamId: string;
    progress: number;
  }>;
}

export function KPIBreakdown({ teams, kpis }: KPIBreakdownProps) {
  const data = teams.map(team => {
    const teamKPIs = kpis.filter(kpi => kpi.teamId === team._id);
    const totalKPIs = teamKPIs.length;

    return {
      name: team.name,
      value: totalKPIs,
    };
  }).filter(item => item.value > 0);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>KPI Distribution by Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, "KPIs"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}