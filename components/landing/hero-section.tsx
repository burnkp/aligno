"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import logger from "@/utils/logger";

export function HeroSection() {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn && userId && !user && clerkUser?.emailAddresses[0]?.emailAddress === "kushtrim@promnestria.biz") {
      setIsLoading(true);
      ensureSuperAdmin({ userId })
        .then(() => {
          logger.info("Super admin created successfully");
        })
        .catch((error) => {
          logger.error("Error creating super admin:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isSignedIn, userId, user, clerkUser, ensureSuperAdmin]);

  const handleDashboardClick = () => {
    if (!isSignedIn || !userId) {
      logger.warn("User not signed in or missing userId");
      return;
    }
    setIsLoading(true);

    try {
      // Check if user is super admin by email
      const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;
      if (userEmail === "kushtrim@promnestria.biz") {
        logger.info("Super admin detected, redirecting to admin dashboard");
        router.push("/admin/dashboard");
        return;
      }

      // For other users, check their role
      if (user) {
        if (user.role === "org_admin") {
          logger.info("Organization admin detected, redirecting to organization dashboard");
          router.push(`/organizations/${user.organizationId}`);
        } else if (user.role === "team_leader" || user.role === "team_member") {
          logger.info("Team member detected, redirecting to teams dashboard");
          router.push("/teams");
        }
      } else {
        logger.warn("User data not found");
      }
    } catch (error) {
      logger.error("Error navigating to dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Aligno
        </span>
      </h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
        The modern platform for managing organizations, teams, and projects.
        Streamline your workflow and boost productivity.
      </p>
      <div className="flex gap-4 mt-8">
        {!isSignedIn && (
          <Button asChild size="lg" disabled={isLoading}>
            <Link href="/get-started">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {isSignedIn ? (
          <Button size="lg" onClick={handleDashboardClick} disabled={isLoading}>
            {isLoading ? "Loading..." : "Go to Dashboard"}
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button variant="outline" size="lg" disabled={isLoading}>
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
} 