"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
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

interface TeamMember {
  userId: string;
  role: "leader" | "member";
  joinedAt: string;
}

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
      console.error("Failed to remove member:", error);
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
                <Badge variant={member.role === "leader" ? "default" : "secondary"}>
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(member.joinedAt).toLocaleDateString()}
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