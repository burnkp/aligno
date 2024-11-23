"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from "lucide-react";
import { InviteMemberModal } from "./invite-member-modal";

interface TeamCardProps {
  team: {
    _id: string;
    name: string;
    description?: string;
    members: Array<{
      name: string;
      role: string;
      userId: string;
    }>;
  };
  currentUserId: string;
}

export function TeamCard({ team, currentUserId }: TeamCardProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const currentUserRole = team.members.find(
    member => member.userId === currentUserId
  )?.role;

  const canInviteMembers = currentUserRole === "admin" || currentUserRole === "leader";

  return (
    <>
      <Card className="hover:shadow-lg transition">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
          {canInviteMembers && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <UserPlus className="h-5 w-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {team.description && (
            <p className="text-sm text-muted-foreground mb-4">
              {team.description}
            </p>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Members</span>
              <span className="font-medium">{team.members.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {team.members.map((member, index) => (
                <div
                  key={index}
                  className="text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  {member.name} ({member.role})
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        teamId={team._id}
      />
    </>
  );
}