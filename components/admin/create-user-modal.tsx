"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Id } from "@convex/_generated/dataModel";
import logger from "@/utils/logger";
import { Role } from "@/utils/permissions";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  role: Role;
  organizationId: string;
}

export const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
  const { toast } = useToast();
  const createUser = useMutation(api.users.createUser);
  const organizations = useQuery(api.organizations.getAllOrganizations);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "team_member",
    organizationId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate a temporary userId that will be updated when the user signs in
      const tempUserId = `pending_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      if (!formData.organizationId) {
        throw new Error("Please select an organization");
      }

      await createUser({
        userId: tempUserId,
        name: formData.name,
        email: formData.email.toLowerCase(),
        role: formData.role,
        organizationId: formData.organizationId as Id<"organizations">,
      });

      toast({
        title: "Success",
        description: "User created successfully",
      });

      onClose();
      setFormData({
        name: "",
        email: "",
        role: "team_member",
        organizationId: "",
      });
    } catch (error) {
      logger.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as Role,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter user's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter user's email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="org_admin">Organization Admin</SelectItem>
                <SelectItem value="team_leader">Team Leader</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Select
              value={formData.organizationId}
              onValueChange={(value) =>
                setFormData({ ...formData, organizationId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org._id} value={org._id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 