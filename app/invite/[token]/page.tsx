"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isAccepting, setIsAccepting] = useState(false);
  
  const invitation = useQuery(api.invitations.getByToken, {
    token: params.token as string,
  });
  const acceptInvitation = useMutation(api.teams.acceptInvitation);

  useEffect(() => {
    if (invitation === undefined) return;
    
    if (!invitation) {
      toast({
        title: "Invalid Invitation",
        description: "This invitation link is invalid or has expired.",
        variant: "destructive",
      });
    }
  }, [invitation, toast]);

  const handleAcceptInvitation = async () => {
    if (!isSignedIn || !user || !invitation) return;

    try {
      setIsAccepting(true);
      await acceptInvitation({
        token: params.token as string,
      });
      
      toast({
        title: "Success",
        description: "You have successfully joined the team",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isAuthLoaded || invitation === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-destructive">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This invitation link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Team Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            You have been invited to join {invitation.teamName} as a {invitation.role}.
          </p>
          {!isSignedIn ? (
            <SignInButton mode="modal" redirectUrl={`/invite/${params.token}`}>
              <Button className="w-full">
                Sign in to accept invitation
              </Button>
            </SignInButton>
          ) : (
            <Button
              className="w-full"
              onClick={handleAcceptInvitation}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 