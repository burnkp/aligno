"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import logger from "@/utils/logger";
import { Role } from "@/utils/permissions";

const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);
  const ensureOrgAdmin = useMutation(api.users.ensureOrgAdmin);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<Id<"users"> | null>(null);

  // Get email and orgName from URL params
  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");

  // Log initial mount state
  useEffect(() => {
    logger.info("AuthCallback mounted", {
      isSignedIn,
      isUserLoaded,
      userId,
      hasClerkUser: !!clerkUser,
      hasConvexUser: !!user,
      isCreatingOrg,
      createdUserId,
      email,
      orgName
    });
  }, [isSignedIn, isUserLoaded, userId, clerkUser, user, isCreatingOrg, createdUserId, email, orgName]);

  const handleRedirect = useCallback(async () => {
    if (!isSignedIn || !isUserLoaded || !clerkUser) {
      logger.warn("Missing required auth data", {
        isSignedIn,
        isUserLoaded,
        hasClerkUser: !!clerkUser
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
      isCreatingOrg,
      searchParams: {
        email,
        orgName
      }
    });

    try {
      // Handle super admin
      if (userEmail === SUPER_ADMIN_EMAIL) {
        logger.info("Super admin detected");
        if (!user) {
          await ensureSuperAdmin({ userId: userId! });
          // Wait for user query to update
          return;
        }
        router.push("/admin/dashboard");
        return;
      }

      // Handle new organization admin
      if (email && orgName && email.toLowerCase() === userEmail) {
        if (!user && !isCreatingOrg) {
          logger.info("Creating new organization", {
            email: userEmail,
            orgName
          });
          setIsCreatingOrg(true);
          const newUserId = await ensureOrgAdmin({
            userId: userId!,
            email: userEmail,
            orgName
          });
          setCreatedUserId(newUserId);
          // Wait for user query to update
          return;
        }

        // If org is being created, wait for user data
        if (isCreatingOrg && !user) {
          logger.info("Waiting for user data after org creation");
          return;
        }

        // Once we have user data after org creation
        if (isCreatingOrg && user && createdUserId === user._id) {
          logger.info("Organization created, redirecting", {
            organizationId: user.organizationId
          });
          router.push(`/admin/organizations/${user.organizationId}/welcome`);
          setIsCreatingOrg(false);
          setCreatedUserId(null);
          return;
        }
      }

      // Handle existing user
      if (user && !isCreatingOrg) {
        logger.info("Processing existing user", {
          role: user.role,
          organizationId: user.organizationId
        });

        if (user.organizationId === "SYSTEM") {
          router.push("/admin/dashboard");
        } else if (user.role === "org_admin") {
          router.push(`/admin/organizations/${user.organizationId}/welcome`);
        } else {
          router.push("/teams");
        }
        return;
      }

      logger.info("No redirect condition met, waiting for state changes", {
        hasUser: !!user,
        isCreatingOrg,
        createdUserId,
        email,
        orgName
      });
    } catch (error) {
      logger.error("Error in auth callback", {
        error,
        state: {
          isSignedIn,
          isUserLoaded,
          userId,
          userEmail,
          hasUser: !!user,
          isCreatingOrg
        }
      });
      setIsCreatingOrg(false);
      setCreatedUserId(null);
      router.push("/error");
    }
  }, [
    isSignedIn,
    isUserLoaded,
    clerkUser,
    userId,
    user,
    router,
    ensureSuperAdmin,
    ensureOrgAdmin,
    isCreatingOrg,
    createdUserId,
    email,
    orgName
  ]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">
          Setting up your account...
        </p>
      </div>
    </div>
  );
}