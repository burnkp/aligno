"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: Id<"teams">;
}

interface FormData {
  userId: string;
  role: "leader" | "member" | "admin";
}

export function AddTeamMemberModal({
  isOpen,
  onClose,
  teamId,
}: AddTeamMemberModalProps) {
  const { toast } = useToast();
  const users = useQuery(api.users.getAllUsers);
  const addMember = useMutation(api.teams.addMember);

  const [formData, setFormData] = useState<FormData>({
    userId: "",
    role: "member",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find the selected user to get their email and name
      const selectedUser = users?.find(user => user.userId === formData.userId);
      if (!selectedUser) {
        throw new Error("Selected user not found");
      }

      await addMember({
        teamId,
        userId: formData.userId,
        email: selectedUser.email,
        name: selectedUser.name,
        role: formData.role,
      });

      toast({
        title: "Success",
        description: "Team member added successfully",
      });

      onClose();
      setFormData({
        userId: "",
        role: "member",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) =>
                setFormData({ ...formData, userId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user._id} value={user.userId}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as "leader" | "member" | "admin",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leader">Team Leader</SelectItem>
                <SelectItem value="member">Team Member</SelectItem>
                <SelectItem value="admin">Team Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 