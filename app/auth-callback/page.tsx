"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { AuthLoading } from "@/components/providers/auth-loading";
import logger from "@/utils/logger";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, userId, isLoaded: isClerkLoaded } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");
  const organizationId = searchParams.get("organizationId");

  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const syncUser = useMutation(api.users.syncUser);
  const updateUserClerkId = useMutation(api.mutations.organizations.updateUserClerkId);
  const getOrgByEmail = useMutation(api.mutations.organizations.getOrgByEmail);

  const handleRedirect = useCallback(async () => {
    if (!isSignedIn || !isUserLoaded || !clerkUser || isProcessing) {
      logger.warn("Missing required auth data", {
        isSignedIn,
        isUserLoaded,
        hasClerkUser: !!clerkUser,
        isProcessing
      });
      return;
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase();

    logger.info("Auth Callback Processing", {
      isSignedIn,
      isUserLoaded,
      userId,
      userEmail,
      convexUser: user,
      searchParams: {
        email,
        orgName,
        organizationId
      }
    });

    try {
      setIsProcessing(true);

      // If we have organization context, update the user's Clerk ID
      if (email && orgName && organizationId) {
        const result = await updateUserClerkId({
          email: email.toLowerCase(),
          clerkId: userId!,
          orgName
        });

        logger.info("Updated user Clerk ID with organization context", {
          email,
          userId,
          orgName,
          organizationId,
          result
        });

        // Redirect to organization dashboard
        router.replace(`/${result.organizationName}`);
        return;
      }

      // Otherwise, sync user data with Clerk
      await syncUser({
        clerkId: userId!,
        email: userEmail!,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown'
      });

      logger.info("User synced successfully", {
        userId,
        email: userEmail
      });

      // Redirect based on user state
      if (user) {
        switch (user.role) {
          case "super_admin":
            router.replace("/admin/dashboard");
            break;
          case "org_admin":
            // Get organization name from the user's email
            const org = await getOrgByEmail({ email: userEmail! });
            if (org) {
              router.replace(`/${org.name}`);
            } else {
              router.replace("/sign-in");
            }
            break;
          case "pending":
            router.replace("/get-started");
            break;
          default:
            router.replace("/sign-in");
        }
      } else {
        // If no user record yet, redirect to get-started
        router.replace("/get-started");
      }
    } catch (error) {
      logger.error("Error in auth callback:", error);
      router.replace("/sign-in?error=auth_callback_failed");
    } finally {
      setIsProcessing(false);
    }
  }, [isSignedIn, isUserLoaded, clerkUser, user, userId, email, orgName, organizationId, isProcessing, router, syncUser, updateUserClerkId, getOrgByEmail]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[90%] max-w-md">
        <CardHeader>
          <CardTitle>Setting up your account...</CardTitle>
          <CardDescription>
            Please wait while we configure your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}