"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import logger from "@/utils/logger";

const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export default function AuthCallback() {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);
  const ensureOrgAdmin = useMutation(api.users.ensureOrgAdmin);

  const handleRedirect = useCallback(async () => {
    if (!isSignedIn || !isUserLoaded || !clerkUser) {
      logger.warn("Missing required auth data");
      return;
    }

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    logger.info("Auth Callback State:", {
      isSignedIn,
      isUserLoaded,
      userId,
      userEmail,
      convexUser: user
    });

    try {
      // If super admin
      if (userEmail === SUPER_ADMIN_EMAIL) {
        logger.info("Super admin detected, checking user record");
        if (!user) {
          logger.info("Creating super admin record");
          await ensureSuperAdmin({ userId: userId! });
        }
        logger.info("Redirecting to admin dashboard");
        router.push("/admin/dashboard");
        return;
      }

      // For new organization admins
      if (!user) {
        logger.info("New organization admin detected");
        const searchParams = new URLSearchParams(window.location.search);
        const orgName = searchParams.get("orgName");
        const email = searchParams.get("email");

        if (orgName && email && email.toLowerCase() === userEmail?.toLowerCase()) {
          logger.info("Creating organization admin record");
          await ensureOrgAdmin({
            userId: userId!,
            email: userEmail,
            orgName
          });
          // Redirect to organization dashboard
          router.push("/dashboard");
          return;
        }
      }

      // For existing users
      if (user) {
        switch (user.role) {
          case "org_admin":
            router.push(`/organizations/${user.organizationId}`);
            break;
          case "team_leader":
          case "team_member":
            router.push("/teams");
            break;
          default:
            router.push("/");
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      logger.error("Error in auth callback:", error);
      router.push("/");
    }
  }, [isSignedIn, isUserLoaded, clerkUser, userId, user, router, ensureSuperAdmin, ensureOrgAdmin]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}