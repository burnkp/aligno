"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import logger from "@/utils/logger";

export default function GetStarted() {
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
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
        email,
        orgName
      });

      // Create organization
      const organizationId = await createOrganization({
        name: orgName,
        adminEmail: email.toLowerCase()
      });

      logger.info("Organization created", {
        organizationId,
        orgName
      });

      // Send welcome email
      await sendWelcomeEmail({
        email: email.toLowerCase(),
        orgName,
        organizationId
      });

      logger.info("Welcome email sent", {
        email
      });

      // Redirect to confirmation page
      router.push(`/get-started/confirmation?email=${encodeURIComponent(email)}&orgName=${encodeURIComponent(orgName)}`);
    } catch (error) {
      logger.error("Organization creation failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        email,
        orgName
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Get Started</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create your organization to begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="orgName" className="block text-sm font-medium">
                Organization Name
              </label>
              <Input
                id="orgName"
                name="orgName"
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Inc."
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Organization"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 