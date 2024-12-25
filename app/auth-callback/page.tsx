"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import logger from "@/utils/logger"; // Import logger

const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export default function AuthCallback() {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);

  useEffect(() => {
    async function handleRedirect() {
      logger.info("Auth Callback State: " + JSON.stringify({
        isSignedIn,
        isUserLoaded,
        userId,
        userEmail: clerkUser?.emailAddresses[0]?.emailAddress,
        convexUser: user
      }));

      if (!isSignedIn || !isUserLoaded || !clerkUser) {
        logger.warn("Missing required auth data");
        return;
      }

      const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

      try {
        // If super admin
        if (userEmail === SUPER_ADMIN_EMAIL) {
          logger.info("Super admin detected, checking user record");
          if (!user) {
            logger.info("Creating super admin record");
            // Create super admin if doesn't exist
            await ensureSuperAdmin({ userId: userId! });
          }
          logger.info("Redirecting to admin dashboard");
          router.push("/admin/dashboard");
          return;
        }

        // For other users
        logger.info("Regular user detected: " + JSON.stringify({ user }));
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
    }
    handleRedirect();
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}