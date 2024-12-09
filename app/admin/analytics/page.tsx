"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/page-header";
import { AnalyticsOverview } from "@/components/admin/analytics-overview";
import { Separator } from "@/components/ui/separator";

export default function AnalyticsPage() {
  const organizations = useQuery(api.organizations.getAllOrganizations);

  if (!organizations || organizations.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <PageHeader
          heading="Analytics"
          description="Track and analyze system usage and performance metrics."
        />
        <Separator className="my-6" />
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">
            No organizations found. Create an organization to view analytics.
          </p>
        </div>
      </div>
    );
  }

  // For now, we'll show analytics for the first organization
  // TODO: Add organization selector
  const organizationId = organizations[0]._id;

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="Analytics"
        description="Track and analyze system usage and performance metrics."
      />
      <Separator className="my-6" />
      <AnalyticsOverview organizationId={organizationId} />
    </div>
  );
} 