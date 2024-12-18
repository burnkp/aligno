"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
const logger = require("../../logger");

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrganizationModal = ({
  isOpen,
  onClose,
}: CreateOrganizationModalProps) => {
  const { toast } = useToast();
  const createOrganization = useMutation(api.organizations.createOrganization);

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    plan: "basic",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createOrganization({
        name: formData.name,
        contactPerson: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        subscription: {
          plan: formData.plan,
          startDate: new Date().toISOString(),
        },
      });

      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      
      onClose();
      setFormData({
        name: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        plan: "basic",
      });
    } catch (error) {
      logger.error(error);
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Person Name</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) =>
                setFormData({ ...formData, contactName: e.target.value })
              }
              placeholder="Enter contact person name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              placeholder="Enter contact email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              placeholder="Enter contact phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan">Subscription Plan</Label>
            <select
              id="plan"
              value={formData.plan}
              onChange={(e) =>
                setFormData({ ...formData, plan: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
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
              {isLoading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 