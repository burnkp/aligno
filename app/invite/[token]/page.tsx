"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
const logger = require("../../../logger");

export default function InvitationPage({ params }: { params: { token: string } }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signIn } = useSignIn();
  const router = useRouter();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);

  const invitation = useQuery(api.invitations.getByToken, { 
    token: params.token 
  });

  const acceptInvitation = useMutation(api.teams.acceptInvitation);

  // Handle authentication and auto-accept
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        // Store invitation token
        sessionStorage.setItem('pendingInvitationToken', params.token);
      } else if (user) {
        // Auto-accept invitation after authentication
        handleAcceptInvitation();
      }
    }
  }, [isLoaded, isSignedIn, user, params.token]);

  const handleSignIn = () => {
    try {
      // Implement rate limiting (1 attempt per 5 seconds)
      const now = Date.now();
      if (now - lastAttempt < 5000) {
        toast({
          title: "Please wait",
          description: "Too many attempts. Please try again in a few seconds.",
          variant: "destructive",
        });
        return;
      }

      setLastAttempt(now);
      setIsRedirecting(true);
      sessionStorage.setItem('pendingInvitationToken', params.token);
      
      // Redirect to Clerk's sign-in page
      window.location.href = `/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`;
    } catch (error) {
      logger.error("Sign-in error:", error);
      setIsRedirecting(false);
      toast({
        title: "Error",
        description: "Failed to initiate sign-in. Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptInvitation = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to accept the invitation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAccepting(true);

      if (!invitation || invitation.status !== "pending") {
        toast({
          title: "Invalid Invitation",
          description: "This invitation is no longer valid.",
          variant: "destructive",
        });
        return;
      }

      const result = await acceptInvitation({ 
        token: params.token,
        userId: user.id,
        userEmail: user.emailAddresses[0].emailAddress
      });
      
      if (result.success) {
        toast({
          title: "Welcome!",
          description: "You've successfully joined the team.",
        });
        
        // Clear any stored invitation token
        sessionStorage.removeItem('pendingInvitationToken');
        
        // Redirect to the team profile
        router.push(`/dashboard/teams/${invitation.teamId}/profile`);
      }
    } catch (error) {
      logger.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  // Show loading state while checking authentication or processing
  if (!isLoaded || !invitation || isAccepting) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Please wait</h2>
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    </div>;
  }

  // Handle invalid invitation states
  if (invitation.status === "expired") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Invitation Expired</h2>
          <p className="text-gray-600">
            This invitation has expired. Please request a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.status === "accepted") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h2 className="text-2xl font-bold text-green-600">Already Accepted</h2>
          <p className="text-gray-600">
            This invitation has already been accepted.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-gray-600">
            Please sign in to accept this invitation.
          </p>
          <Button 
            onClick={handleSignIn}
            disabled={isRedirecting}
          >
            {isRedirecting ? "Redirecting..." : "Sign in to Accept"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Join Team</h2>
          <p className="mt-2 text-gray-600">
            You've been invited to join as a {invitation.role}
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleAcceptInvitation}
          disabled={isAccepting || !isSignedIn}
        >
          {isAccepting ? (
            "Setting up your account..."
          ) : !isSignedIn ? (
            "Please Sign In First"
          ) : (
            "Accept Invitation"
          )}
        </Button>
      </div>
    </div>
  );
} 