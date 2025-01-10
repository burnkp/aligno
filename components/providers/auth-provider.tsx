"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import logger from "@/utils/logger";
import { AuthLoadingMinimal } from "./auth-loading";

const publicRoutes = ["/", "/get-started", "/sign-in", "/sign-up", "/privacy-policy", "/terms"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: isClerkLoaded, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isClerkLoaded || !isUserLoaded) return;

    logger.info("Auth state change", {
      isClerkLoaded,
      isUserLoaded,
      userId,
      hasClerkUser: !!clerkUser,
      hasConvexUser: !!user,
      pathname
    });

    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

    // Handle unauthenticated users
    if (!userId) {
      if (!isPublicRoute) {
        logger.info("Redirecting unauthenticated user to sign-in", { from: pathname });
        router.replace("/sign-in");
      }
      return;
    }

    // If no Convex user yet, show loading while webhook creates it
    if (!user) {
      if (!isPublicRoute) {
        logger.info("Waiting for user record", { userId });
      }
      return;
    }

    // Handle different user states
    if (user.role === "pending") {
      if (pathname !== "/get-started") {
        logger.info("Redirecting pending user to get-started", { from: pathname });
        router.replace("/get-started");
      }
      return;
    }

    if (user.role === "super_admin" && pathname !== "/admin/dashboard") {
      logger.info("Redirecting super admin to dashboard", { from: pathname });
      router.replace("/admin/dashboard");
      return;
    }

    if (user.role === "org_admin" && !pathname.startsWith("/admin/organizations")) {
      logger.info("Redirecting org admin to org dashboard", { 
        from: pathname,
        organizationId: user.organizationId 
      });
      router.replace(`/admin/organizations/${user.organizationId}/welcome`);
      return;
    }

    logger.info("Auth check completed", {
      role: user.role,
      pathname
    });
  }, [isClerkLoaded, isUserLoaded, userId, clerkUser, user, router, pathname]);

  // Show loading state while checking auth
  if (!isClerkLoaded || !isUserLoaded) {
    return <AuthLoadingMinimal />;
  }

  // Show loading while waiting for user record
  if (userId && !user && !publicRoutes.some(route => pathname?.startsWith(route))) {
    return <AuthLoadingMinimal />;
  }

  return <>{children}</>;
}