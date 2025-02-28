"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns, Team } from "@/components/admin/teams-columns";
import { CreateTeamModal } from "@/components/admin/create-team-modal";
import { PageHeader } from "@/components/page-header";
import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";
import { Role } from "@/utils/permissions";

export default function TeamsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const params = useParams();
  const organizationId = params.organizationId as Id<"organizations">;
  const rawTeams = useQuery(api.teams.getOrganizationTeams, { organizationId });

  // Transform the teams data to match the expected Team type
  const teams = rawTeams?.map(team => ({
    _id: team._id.toString(),
    name: team.name,
    description: team.description,
    organizationId: team.organizationId || organizationId.toString(),
    leaderId: team.leaderId || team.members.find(m => ["team_leader", "org_admin", "super_admin"].includes(m.role))?.userId || team.members[0]?.userId || "",
    members: team.members.map(member => {
      let role: Role;
      if (member.role === "super_admin") role = "super_admin";
      else if (member.role === "org_admin") role = "org_admin";
      else if (member.role === "team_leader") role = "team_leader";
      else role = "team_member";

      return {
        userId: member.userId,
        role,
        joinedAt: member.joinedAt,
      };
    }),
    createdAt: team.createdAt || new Date().toISOString(),
    updatedAt: team.updatedAt || new Date().toISOString(),
  })) as Team[] | undefined;

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
      />
    </div>
  );
} 