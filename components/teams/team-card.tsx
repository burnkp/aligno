"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InviteMemberModal } from "./invite-member-modal";
import { Id } from "@/convex/_generated/dataModel";
import { TeamMember } from "@/types/teams";
import { getUserRole, canInviteMembers } from "@/utils/permissions";

interface TeamCardProps {
  id: Id<"teams">;
  name: string;
  description?: string;
  members: TeamMember[];
  isMember: boolean;
}

export function TeamCard({
  id,
  name,
  description,
  members,
  isMember,
}: TeamCardProps) {
  const router = useRouter();
  const { user } = useUser();
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!user) return null;

  const userRole = isMember ? getUserRole({ _id: id, members } as any, user.id) : null;
  const canInvite = userRole && canInviteMembers(userRole);

  const handleViewTeam = () => {
    router.push(`/dashboard/teams/${id}/profile`);
  };

  const handleInvite = () => {
    setShowInviteModal(true);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{name}</span>
            {isMember && canInvite && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInvite}
              >
                Invite
              </Button>
            )}
          </CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((member, index) => (
                <Avatar key={member.userId} className="border-2 border-white">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${member.email}`}
                    alt={member.name}
                  />
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 5 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white">
                  <span className="text-xs">+{members.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant={isMember ? "default" : "secondary"}
            onClick={handleViewTeam}
          >
            {isMember ? "View Team" : "View Invitation"}
          </Button>
        </CardFooter>
      </Card>

      {showInviteModal && (
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          teamId={id}
        />
      )}
    </>
  );
}