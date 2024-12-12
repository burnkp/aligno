"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export default function AuthCallback() {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);

  useEffect(() => {
    const handleRedirect = async () => {
      console.log("Auth Callback State:", {
        isSignedIn,
        isUserLoaded,
        userId,
        userEmail: clerkUser?.emailAddresses[0]?.emailAddress,
        convexUser: user
      });

      if (!isSignedIn || !isUserLoaded || !clerkUser) {
        console.log("Missing required auth data");
        return;
      }

      const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

      try {
        // If super admin
        if (userEmail === SUPER_ADMIN_EMAIL) {
          console.log("Super admin detected, checking user record");
          if (!user) {
            console.log("Creating super admin record");
            // Create super admin if doesn't exist
            await ensureSuperAdmin({ userId: userId! });
          }
          console.log("Redirecting to admin dashboard");
          router.push("/admin/dashboard");
          return;
        }

        // For other users
        console.log("Regular user detected:", { user });
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
        console.error("Error in auth callback:", error);
        router.push("/");
      }
    };

    handleRedirect();
  }, [isSignedIn, isUserLoaded, clerkUser, user, userId, router, ensureSuperAdmin]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
} 