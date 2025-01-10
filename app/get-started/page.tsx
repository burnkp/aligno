"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logger from "@/utils/logger";

export default function GetStarted() {
  const [formData, setFormData] = useState({
    orgName: "",
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const createOrganization = useMutation(api.organizations.create);
  const sendWelcomeEmail = useMutation(api.email.sendWelcomeEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      logger.info("Starting organization creation", {
        email: formData.email,
        orgName: formData.orgName,
        name: formData.name
      });

      // Create organization and admin user
      const result = await createOrganization({
        name: formData.orgName,
        adminEmail: formData.email.toLowerCase(),
        adminName: formData.name
      });

      logger.info("Organization created", {
        organizationId: result.organizationId,
        userId: result.userId,
        orgName: formData.orgName
      });

      // Send welcome email
      await sendWelcomeEmail({
        email: formData.email.toLowerCase(),
        name: formData.name,
        orgName: formData.orgName,
        organizationId: result.organizationId
      });

      logger.info("Welcome email sent", {
        email: formData.email,
        organizationId: result.organizationId
      });

      // Redirect to confirmation page
      router.push(
        `/get-started/confirmation?${new URLSearchParams({
          email: formData.email,
          orgName: formData.orgName,
          organizationId: result.organizationId
        }).toString()}`
      );

      toast({
        title: "Organization Created",
        description: "Please check your email to access your organization's dashboard.",
      });
    } catch (error) {
      logger.error("Organization creation failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        email: formData.email,
        orgName: formData.orgName
      });

      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Organization</CardTitle>
          <CardDescription>
            Enter your details to get started with Aligno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={formData.orgName}
                onChange={(e) => setFormData(prev => ({ ...prev, orgName: e.target.value }))}
                placeholder="Enter organization name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Organization..." : "Create Organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 