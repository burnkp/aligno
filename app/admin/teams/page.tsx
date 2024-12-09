"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/admin/teams-columns";
import { CreateTeamModal } from "@/components/admin/create-team-modal";
import { PageHeader } from "@/components/page-header";
import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";

export default function TeamsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const params = useParams();
  const organizationId = params.organizationId as Id<"organizations">;
  const teams = useQuery(api.teams.getOrganizationTeams, { organizationId });

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading="Teams Management"
        description="Create and manage teams within your organization."
      >
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </PageHeader>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={teams || []}
          searchKey="name"
          loading={teams === undefined}
        />
      </div>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        organizationId={organizationId}
      />
    </div>
  );
} 