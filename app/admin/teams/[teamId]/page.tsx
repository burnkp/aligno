"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMembersTable } from "@/components/admin/team-members-table";
import { TeamSettingsForm } from "@/components/admin/team-settings-form";
import { TeamActivityLog } from "@/components/admin/team-activity-log";
import { Id } from "@convex/_generated/dataModel";
import { TeamMember } from "@/types/teams";
import { Role } from "@/utils/permissions";

interface TeamSettings {
  _id: Id<"teams">;
  name: string;
  description?: string;
  leaderId: string;
  settings?: {
    isPrivate?: boolean;
    allowMemberInvites?: boolean;
    requireLeaderApproval?: boolean;
  };
}

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = params.teamId as Id<"teams">;
  const team = useQuery(api.teams.getTeam, { teamId });

  if (!team) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  // Transform members data to match TeamMembersTable's expected format
  const transformedMembers: TeamMember[] = team.members.map(member => {
    let role: Role;
    if (member.role === "super_admin") role = "super_admin";
    else if (member.role === "org_admin") role = "org_admin";
    else if (member.role === "team_leader") role = "team_leader";
    else role = "team_member";

    return {
      userId: member.userId,
      role,
      joinedAt: member.joinedAt,
      email: member.email,
      name: member.name
    };
  });

  // Transform team data to match TeamSettingsForm's expected format
  const teamSettings: TeamSettings = {
    _id: team._id,
    name: team.name,
    description: team.description,
    leaderId: team.leaderId || team.members.find(m => ["team_leader", "org_admin", "super_admin"].includes(m.role))?.userId || team.members[0].userId,
    settings: {
      isPrivate: team.settings?.isPrivate,
      allowMemberInvites: team.settings?.allowMemberInvites,
      requireLeaderApproval: team.settings?.requireLeaderApproval,
    },
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        heading={team.name}
        description="Manage team members, settings, and view activity"
      >
        <Button variant="outline">Edit Team</Button>
      </PageHeader>

      <div className="mt-8">
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamMembersTable teamId={teamId} members={transformedMembers} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamSettingsForm team={teamSettings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamActivityLog teamId={teamId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 