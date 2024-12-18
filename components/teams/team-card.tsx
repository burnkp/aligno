"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { getUserRole, canInviteMembers, canManageTeam } from "@/utils/permissions";
import { MoreHorizontal, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: "leader" | "member" | "admin";
  joinedAt: string;
}

interface TeamCardProps {
  id: Id<"teams">;
  name: string;
  description?: string;
  members: TeamMember[];
  onInvite?: () => void;
}

export function TeamCard({ id, name, description, members, onInvite }: TeamCardProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const deleteTeam = useMutation(api.teams.deleteTeam);

  if (!user) return null;

  const isMember = members.some(member => member.userId === user.id);
  const userRole = isMember ? getUserRole(user.id, { members }) : null;
  const canInvite = userRole && canInviteMembers(userRole);
  const canManage = userRole && canManageTeam(userRole);

  const handleDelete = async () => {
    try {
      await deleteTeam({ teamId: id });
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete team",
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
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          )}
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDelete}
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
        <div className="space-y-2">
          <div className="text-sm font-medium">Members ({members.length})</div>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <Badge
                key={member.userId}
                variant={member.role === "leader" ? "default" : "secondary"}
              >
                {member.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}