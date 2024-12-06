"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface KPIDashboardProps {
  objectiveId: Id<"strategicObjectives">;
}

export const KPIDashboard = ({ objectiveId }: KPIDashboardProps) => {
  const kpis = useQuery(api.kpis.getKPIsByObjective, { objectiveId });

  if (!kpis) {
    return <div>Loading KPI dashboard...</div>;
  }

  // Calculate KPI performance metrics
  const kpiMetrics = kpis.map((kpi) => {
    const target = kpi.target;
    const current = kpi.current;
    const progress = (current / target) * 100;
    const previousProgress = ((kpi.previous || 0) / target) * 100;
    const trend = progress - previousProgress;

    return {
      ...kpi,
      progress,
      trend,
      status:
        progress >= 100
          ? "completed"
          : progress >= 75
          ? "on-track"
          : progress >= 50
          ? "at-risk"
          : "behind",
    };
  });

  // Prepare data for bar chart
  const chartData = kpiMetrics.map((kpi) => ({
    name: kpi.name,
    Target: kpi.target,
    Current: kpi.current,
    Previous: kpi.previous || 0,
  }));

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <MinusIcon className="w-4 h-4 text-gray-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "on-track":
        return "bg-blue-500";
      case "at-risk":
        return "bg-yellow-500";
      case "behind":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KPI Overview</CardTitle>
          <CardDescription>
            Compare current performance against targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Target" fill="#94a3b8" />
                <Bar dataKey="Current" fill="#2563eb" />
                <Bar dataKey="Previous" fill="#9333ea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KPI Details</CardTitle>
          <CardDescription>
            Detailed view of all KPIs with progress and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpiMetrics.map((kpi) => (
                <TableRow key={kpi._id}>
                  <TableCell className="font-medium">{kpi.name}</TableCell>
                  <TableCell>{kpi.target}</TableCell>
                  <TableCell>{kpi.current}</TableCell>
                  <TableCell className="w-[200px]">
                    <div className="space-y-1">
                      <Progress value={kpi.progress} />
                      <span className="text-sm text-muted-foreground">
                        {Math.round(kpi.progress)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.trend)}
                      <span
                        className={
                          kpi.trend > 0
                            ? "text-green-500"
                            : kpi.trend < 0
                            ? "text-red-500"
                            : "text-gray-500"
                        }
                      >
                        {kpi.trend > 0 && "+"}
                        {Math.round(kpi.trend)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        kpi.status
                      )} text-white capitalize`}
                    >
                      {kpi.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(kpi.updatedAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 