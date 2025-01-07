"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { getUserRole, canInviteMembers, canManageTeam, Role } from "@/utils/permissions";
import { MoreHorizontal, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logger from "@/utils/logger";
import { TeamMember } from "@/types/teams";

interface TeamCardProps {
  id: Id<"teams">;
  name: string;
  description?: string;
  members: TeamMember[];
  onInvite?: () => void;
}

interface TeamInvitation {
  _id: Id<"invitations">;
  name: string;
  email: string;
  role: "org_admin" | "team_leader" | "team_member";
  status: "pending" | "accepted" | "expired" | "bounced";
}

export function TeamCard({ id, name, description, members, onInvite }: TeamCardProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const deleteTeam = useMutation(api.teams.deleteTeam);
  const invitations = useQuery(api.teams.getTeamInvitations, { teamId: id }) as TeamInvitation[] | undefined;

  if (!user) return null;

  const userRole = getUserRole(user.id, { members }) as Role;
  const canInvite = canInviteMembers(userRole);
  const canManage = canManageTeam(userRole);

  const handleDelete = async () => {
    try {
      await deleteTeam({ teamId: id });
      toast({
        title: "Team deleted",
        description: "The team has been successfully deleted.",
      });
    } catch (error) {
      logger.error("Failed to delete team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <div className="flex items-center space-x-2">
          {canInvite && (
            <Button
              onClick={onInvite}
              size="sm"
              variant="outline"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite
            </Button>
          )}
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  Delete Team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {members.length} {members.length === 1 ? "member" : "members"}
          </Badge>
          {userRole && (
            <Badge>
              {userRole.replace("_", " ")}
            </Badge>
          )}
          {invitations && invitations.length > 0 && (
            <Badge variant="outline">
              {invitations.length} pending {invitations.length === 1 ? "invitation" : "invitations"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}