"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import logger from "@/utils/logger";
import { Id } from "@convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

interface TeamSettingsFormProps {
  team: {
    _id: Id<"teams">;
    name: string;
    description?: string;
    leaderId: string;
    settings?: {
      isPrivate?: boolean;
      allowMemberInvites?: boolean;
      requireLeaderApproval?: boolean;
    };
  };
}

interface FormData {
  name: string;
  description: string;
  leaderId: string;
  settings: {
    isPrivate: boolean;
    allowMemberInvites: boolean;
    requireLeaderApproval: boolean;
  };
}

export function TeamSettingsForm({ team }: TeamSettingsFormProps) {
  const { toast } = useToast();
  const updateTeam = useMutation(api.teams.updateTeam);

  const [formData, setFormData] = useState<FormData>({
    name: team.name,
    description: team.description || "",
    leaderId: team.leaderId,
    settings: {
      isPrivate: team.settings?.isPrivate ?? false,
      allowMemberInvites: team.settings?.allowMemberInvites ?? true,
      requireLeaderApproval: team.settings?.requireLeaderApproval ?? true,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateTeam({
        teamId: team._id,
        name: formData.name,
        description: formData.description,
        leaderId: formData.leaderId,
        settings: formData.settings,
      });

      toast({
        title: "Success",
        description: "Team settings updated successfully",
      });
    } catch (error) {
      logger.error(error);
      toast({
        title: "Error",
        description: "Failed to update team settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Team Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Private Team</Label>
                <p className="text-sm text-muted-foreground">
                  Only members can view team content
                </p>
              </div>
              <Switch
                checked={formData.settings.isPrivate}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, isPrivate: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Member Invites</Label>
                <p className="text-sm text-muted-foreground">
                  Members can invite others to join
                </p>
              </div>
              <Switch
                checked={formData.settings.allowMemberInvites}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, allowMemberInvites: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Leader Approval</Label>
                <p className="text-sm text-muted-foreground">
                  Team leader must approve new members
                </p>
              </div>
              <Switch
                checked={formData.settings.requireLeaderApproval}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      requireLeaderApproval: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
} 