"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { AuthLoading } from "@/components/providers/auth-loading";
import logger from "@/utils/logger";

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

      // Sync user data with Clerk
      await syncUser({
        userId: userId!,
        email: userEmail!,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown',
        imageUrl: clerkUser.imageUrl || undefined
      });

      logger.info("User synced successfully", {
        userId,
        email: userEmail,
        organizationId
      });

      // Redirect based on user state
      if (user) {
        switch (user.role) {
          case "super_admin":
            router.replace("/admin/dashboard");
            break;
          case "org_admin":
            router.replace(`/admin/organizations/${user.organizationId}/welcome`);
            break;
          case "pending":
            router.replace("/get-started");
            break;
          default:
            router.replace("/sign-in");
        }
      } else {
        // If no user record yet, wait for webhook to process
        logger.info("Waiting for user record to be created", {
          userId,
          email: userEmail
        });
      }
    } catch (error) {
      logger.error("Error in auth callback:", error);
      router.replace("/sign-in?error=auth_callback_failed");
    } finally {
      setIsProcessing(false);
    }
  }, [isSignedIn, isUserLoaded, clerkUser, userId, user, router, email, orgName, organizationId, syncUser, isProcessing]);

  useEffect(() => {
    if (isClerkLoaded && isUserLoaded) {
      handleRedirect();
    }
  }, [isClerkLoaded, isUserLoaded, handleRedirect]);

  return <AuthLoading />;
}