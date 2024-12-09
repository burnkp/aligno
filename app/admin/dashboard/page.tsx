"use client";

import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Building2,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const organizations = useQuery(api.organizations.getAllOrganizations);
  const users = useQuery(api.users.getAllUsers);

  const stats = [
    {
      title: "Total Organizations",
      value: organizations?.length ?? 0,
      icon: Building2,
      description: "Active customer organizations",
      trend: {
        value: "+12.3%",
        isPositive: true,
      },
    },
    {
      title: "Total Users",
      value: users?.length ?? 0,
      icon: Users,
      description: "Users across all organizations",
      trend: {
        value: "+8.2%",
        isPositive: true,
      },
    },
    {
      title: "Active Teams",
      value: "24",
      icon: BarChart3,
      description: "Teams across organizations",
      trend: {
        value: "-2.1%",
        isPositive: false,
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all organizations and system metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  <span
                    className={`ml-2 flex items-center text-sm font-medium ${
                      stat.trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend.isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.trend.value}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  stat.trend.isPositive ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <stat.icon
                  className={`h-6 w-6 ${
                    stat.trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional sections will be added here */}
    </div>
  );
} 