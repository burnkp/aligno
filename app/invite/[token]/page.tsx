"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function InvitationPage({ params }: { params: { token: string } }) {
  const { isSignedIn, user } = useUser();
  const { signIn } = useSignIn();
  const router = useRouter();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);

  const invitation = useQuery(api.invitations.getByToken, { 
    token: params.token 
  });

  const acceptInvitation = useMutation(api.teams.acceptInvitation);

  const handleAcceptInvitation = async () => {
    if (!isSignedIn || !user) {
      // Store the invitation token in sessionStorage
      sessionStorage.setItem('pendingInvitationToken', params.token);
      // Redirect to Clerk sign-in
      signIn?.create({
        strategy: "oauth_google",
        redirectUrl: window.location.href,
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
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  // Effect to handle post-authentication acceptance
  useEffect(() => {
    const pendingToken = sessionStorage.getItem('pendingInvitationToken');
    if (isSignedIn && user && pendingToken === params.token) {
      handleAcceptInvitation();
    }
  }, [isSignedIn, user]);

  if (!invitation) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

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
          disabled={isAccepting}
        >
          {isAccepting ? (
            "Accepting..."
          ) : isSignedIn ? (
            "Accept Invitation"
          ) : (
            "Sign in to Accept"
          )}
        </Button>
      </div>
    </div>
  );
} 