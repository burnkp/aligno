"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Trash2, Circle, CircleDot } from "lucide-react";
import { InviteMemberModal } from "./invite-member-modal";
import { RemoveMemberModal } from "./remove-member-modal";
import { DeleteTeamModal } from "./delete-team-modal";
import { Id } from "@/convex/_generated/dataModel";
import { TeamMember } from "@/types/teams";
import { getUserRole, canInviteMembers, canManageTeam } from "@/utils/permissions";
import { cn } from "@/lib/utils";

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
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);

  if (!user) return null;

  const userRole = isMember ? getUserRole({ _id: id, members } as any, user.id) : null;
  const canInvite = userRole && canInviteMembers(userRole);
  const canManage = userRole && canManageTeam(userRole);

  const handleViewTeam = () => {
    router.push(`/dashboard/teams/${id}/profile`);
  };

  // Sort members to put team leader first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "admin") return -1;
    if (b.role === "admin") return 1;
    return 0;
  });

  return (
    <>
      <Card className="hover:shadow-md transition-shadow bg-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">{name}</CardTitle>
              {description && (
                <CardDescription className="mt-1 text-sm text-gray-500">
                  {description}
                </CardDescription>
              )}
            </div>
            {isMember && (
              <div className="flex gap-2">
                {canInvite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowInviteModal(true)}
                    className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                )}
                {canManage && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowRemoveMemberModal(true)}
                      className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowDeleteTeamModal(true)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Team Members</h3>
            <div className="space-y-3">
              {sortedMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-3"
                >
                  {member.role === "admin" ? (
                    <CircleDot className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className={cn(
                      "text-sm",
                      member.role === "admin" && "font-medium"
                    )}>
                      {member.name}
                      {member.role === "admin" && (
                        <span className="ml-2 text-xs text-purple-600">(Team Leader)</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleViewTeam}
          >
            View Team
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

      {showRemoveMemberModal && (
        <RemoveMemberModal
          isOpen={showRemoveMemberModal}
          onClose={() => setShowRemoveMemberModal(false)}
          teamId={id}
          members={members}
          currentUserId={user.id}
        />
      )}

      {showDeleteTeamModal && (
        <DeleteTeamModal
          isOpen={showDeleteTeamModal}
          onClose={() => setShowDeleteTeamModal(false)}
          teamId={id}
          teamName={name}
        />
      )}
    </>
  );
}