"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AuthSetupPage() {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const updateUserClerkId = useMutation(api.mutations.organizations.updateUserClerkId);

  useEffect(() => {
    const setupUser = async () => {
      if (!isLoaded || !user) return;

      try {
        const email = searchParams.get("email");
        const orgName = searchParams.get("orgName");

        if (!email || !orgName) {
          console.error("Missing email or organization name");
          toast({
            title: "Error",
            description: "Missing required information. Please try again.",
            variant: "destructive",
          });
          window.location.replace("/");
          return;
        }

        // Verify email matches
        if (user.primaryEmailAddress?.emailAddress.toLowerCase() !== email.toLowerCase()) {
          toast({
            title: "Error",
            description: "Please sign in with the email address where you received the invitation.",
            variant: "destructive",
          });
          window.location.replace("/sign-in");
          return;
        }

        console.log('Setting up user:', {
          email: email.toLowerCase(),
          clerkId: user.id,
          orgName: decodeURIComponent(orgName)
        });

        // Update user's Clerk ID in Convex
        await updateUserClerkId({
          email: email.toLowerCase(),
          clerkId: user.id,
          orgName: decodeURIComponent(orgName)
        });

        // Show success message
        toast({
          title: "Success",
          description: "Your account has been set up successfully.",
        });

        // Force a hard redirect to dashboard
        window.location.replace("/dashboard");
      } catch (error) {
        console.error("Error during setup:", error);
        toast({
          title: "Error",
          description: "Failed to set up your account. Please try again.",
          variant: "destructive",
        });
        window.location.replace("/");
      }
    };

    setupUser();
  }, [isLoaded, user, searchParams, updateUserClerkId, toast]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Setting up your account...</p>
        <p className="text-sm text-muted-foreground">Please wait while we configure your organization.</p>
      </div>
    </div>
  );
} 