"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function OrganizationDashboard() {
  const params = useParams();
  const organizationName = params.organizationName as string;
  const organization = useQuery(api.queries.organizations.getByName, { name: organizationName });
  const user = useQuery(api.users.getCurrentUser);

  if (!organization || !user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome to {organization.name}</CardTitle>
            <CardDescription>
              Get started by creating your first strategic objective, OKR, or KPI.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Strategic Objective
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add OKR
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add KPI
            </Button>
          </CardContent>
        </Card>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Objectives</CardTitle>
              <CardDescription>Track your high-level goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OKRs</CardTitle>
              <CardDescription>Monitor your objectives and key results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KPIs</CardTitle>
              <CardDescription>Measure your key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 