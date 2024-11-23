"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const acceptInvitation = useMutation(api.teams.acceptInvitation);

  const handleAcceptInvitation = async () => {
    try {
      setIsLoading(true);
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
        description: "Invalid or expired invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Team Invitation</CardTitle>
        <CardDescription>
          You have been invited to join a team on Aligno
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleAcceptInvitation}
          disabled={isLoading}
          className="w-full"
        >
          Accept Invitation
        </Button>
      </CardContent>
    </Card>
  );
}