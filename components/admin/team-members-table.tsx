"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { AddTeamMemberModal } from "./add-team-member-modal";
import logger from "@/utils/logger";
import { TeamMember } from "@/types/teams";

interface TeamMembersTableProps {
  teamId: Id<"teams">;
  members: TeamMember[];
}

export function TeamMembersTable({ teamId, members }: TeamMembersTableProps) {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const removeMember = useMutation(api.teams.removeMember);

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember({ teamId, userId });
    } catch (error) {
      logger.error("Failed to remove member:", error);
    }
  };

  const getRoleBadgeVariant = (role: TeamMember["role"]) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "org_admin":
        return "default";
      case "team_leader":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddMemberModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.userId}>
              <TableCell>{member.userId}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.userId)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddTeamMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        teamId={teamId}
      />
    </div>
  );
} 