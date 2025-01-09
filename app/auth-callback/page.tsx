"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import logger from "@/utils/logger";
import { Role } from "@/utils/permissions";

const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

interface ConvexUser {
  _id: Id<"users">;
  _creationTime: number;
  userId: string;
  email: string;
  name: string;
  role: Role;
  organizationId: "SYSTEM" | Id<"organizations">;
  createdAt: string;
  updatedAt: string;
}

export default function AuthCallback() {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" }) as ConvexUser | null;
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);
  const ensureOrgAdmin = useMutation(api.users.ensureOrgAdmin);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<Id<"users"> | null>(null);

  // Log initial mount state
  useEffect(() => {
    logger.info("AuthCallback mounted", {
      isSignedIn,
      isUserLoaded,
      userId,
      hasClerkUser: !!clerkUser,
      hasConvexUser: !!user,
      isCreatingOrg,
      createdUserId
    });
  }, [isSignedIn, isUserLoaded, userId, clerkUser, user, isCreatingOrg, createdUserId]);

  // Log state changes
  useEffect(() => {
    logger.info("AuthCallback state updated", {
      isSignedIn,
      isUserLoaded,
      userId,
      hasClerkUser: !!clerkUser,
      hasConvexUser: !!user,
      isCreatingOrg,
      createdUserId,
      userEmail: clerkUser?.emailAddresses[0]?.emailAddress,
      convexUserRole: user?.role,
      convexUserOrgId: user?.organizationId
    });
  }, [isSignedIn, isUserLoaded, clerkUser, userId, user, isCreatingOrg, createdUserId]);

  useEffect(() => {
    // If we have a user after org creation, redirect to their dashboard
    if (isCreatingOrg && user && createdUserId === user._id) {
      logger.info("Organization created, attempting redirect", {
        organizationId: user.organizationId,
        role: user.role,
        email: user.email
      });
      
      try {
        // Only redirect if organizationId is not "SYSTEM"
        if (user.organizationId !== "SYSTEM") {
          const redirectUrl = `/admin/organizations/${user.organizationId}/welcome`;
          logger.info("Redirecting to", { redirectUrl });
          router.push(redirectUrl);
        } else {
          logger.info("User has SYSTEM organizationId, redirecting to root");
          router.push("/");
        }
        setIsCreatingOrg(false);
        setCreatedUserId(null);
      } catch (error) {
        logger.error("Redirect failed", { error });
        setIsCreatingOrg(false);
        setCreatedUserId(null);
      }
    }
  }, [isCreatingOrg, user, router, createdUserId]);

  const handleRedirect = useCallback(async () => {
    if (!isSignedIn || !isUserLoaded || !clerkUser) {
      logger.warn("Missing required auth data", {
        isSignedIn,
        isUserLoaded,
        hasClerkUser: !!clerkUser
      });
      return;
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    const searchParams = new URLSearchParams(window.location.search);
    const orgName = searchParams.get("orgName");
    const email = searchParams.get("email");

    logger.info("Auth Callback Processing", {
      isSignedIn,
      isUserLoaded,
      userId,
      userEmail,
      convexUser: user,
      isCreatingOrg,
      searchParams: {
        orgName,
        email
      }
    });

    try {
      // If super admin
      if (userEmail === SUPER_ADMIN_EMAIL) {
        logger.info("Super admin detected, checking user record");
        if (!user) {
          logger.info("Creating super admin record");
          await ensureSuperAdmin({ userId: userId! });
          // Redirect after creating super admin
          router.push("/admin/dashboard");
          return;
        }
        logger.info("Redirecting to admin dashboard");
        router.push("/admin/dashboard");
        return;
      }

      // For new organization admins
      if (!user && !isCreatingOrg) {
        logger.info("New organization admin flow", {
          hasOrgName: !!orgName,
          hasEmail: !!email,
          emailMatch: email?.toLowerCase() === userEmail?.toLowerCase()
        });

        if (orgName && email && email.toLowerCase() === userEmail?.toLowerCase()) {
          logger.info("Creating organization admin record", {
            userId,
            email: userEmail,
            orgName
          });
          setIsCreatingOrg(true);
          const newUserId = await ensureOrgAdmin({
            userId: userId!,
            email: userEmail,
            orgName
          });
          logger.info("Organization admin creation result", { newUserId });
          setCreatedUserId(newUserId);
          return;
        }
      }

      // For existing users
      if (user && !isCreatingOrg) {
        logger.info("Processing existing user", {
          role: user.role,
          organizationId: user.organizationId
        });

        switch (user.role) {
          case "org_admin":
            if (user.organizationId !== "SYSTEM") {
              const orgUrl = `/admin/organizations/${user.organizationId}/welcome`;
              logger.info("Redirecting org admin", { url: orgUrl });
              router.push(orgUrl);
            } else {
              logger.info("Org admin with SYSTEM organizationId, redirecting to root");
              router.push("/");
            }
            break;
          case "team_leader":
          case "team_member":
            logger.info("Redirecting team member", { url: "/teams" });
            router.push("/teams");
            break;
          default:
            logger.info("Redirecting to default", { url: "/" });
            router.push("/");
        }
      }
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
      router.push("/");
    }
  }, [isSignedIn, isUserLoaded, clerkUser, userId, user, router, ensureSuperAdmin, ensureOrgAdmin, isCreatingOrg]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}