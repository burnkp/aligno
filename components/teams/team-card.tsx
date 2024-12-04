"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { InviteMemberModal } from "./invite-member-modal";
import { useUser } from "@clerk/nextjs";

interface TeamCardProps {
  team: {
    _id: string;
    name: string;
    description?: string;
    members: Array<{
      name: string;
      role: string;
      userId: string;
      email: string;
    }>;
  };
}

export function TeamCard({ team }: TeamCardProps) {
  const { user } = useUser();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Check if current user is admin or leader
  const currentMember = team.members.find(m => m.userId === user?.id);
  const canInviteMembers = currentMember?.role === "admin" || currentMember?.role === "leader";

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{team.name}</span>
            {canInviteMembers && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {team.description || "No description provided"}
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Members ({team.members.length})
              </span>
            </div>
            <div className="space-y-2">
              {team.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{member.name}</span>
                  <span className="text-muted-foreground capitalize">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamId={team._id}
      />
    </>
  );
}