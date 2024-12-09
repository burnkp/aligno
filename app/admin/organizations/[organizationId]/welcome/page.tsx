"use client";

import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { OrganizationWelcomeDashboard } from "@/components/admin/organization-welcome-dashboard";
import { PageHeader } from "@/components/page-header";

export default function OrganizationWelcomePage() {
  const params = useParams();
  const organizationId = params.organizationId as Id<"organizations">;

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="Welcome to Aligno"
        description="Let's get your organization set up and running"
      />
      <div className="mt-8">
        <OrganizationWelcomeDashboard organizationId={organizationId} />
      </div>
    </div>
  );
} 