"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeamMember } from "@/types/teams";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
const logger = require("../../logger");

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: Id<"teams">;
  members: TeamMember[];
  currentUserId: string;
}

export function RemoveMemberModal({
  isOpen,
  onClose,
  teamId,
  members,
  currentUserId,
}: RemoveMemberModalProps) {
  const router = useRouter();
  const removeMember = useMutation(api.teams.removeMember);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRemoveMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      await removeMember({ teamId, userId: memberId });
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
      router.refresh();
    } catch (error) {
      logger.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove team member",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Team Member</DialogTitle>
          <DialogDescription>
            Select a team member to remove from the team.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[300px] mt-4">
          <div className="space-y-4">
            {members
              .filter((member) => member.userId !== currentUserId)
              .map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${member.email}`}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.userId)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 