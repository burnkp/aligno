"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import logger from "@/utils/logger";

export function HeroSection() {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const ensureSuperAdmin = useMutation(api.users.ensureSuperAdmin);

  useEffect(() => {
    const initializeUser = async () => {
      if (isSignedIn && userId && !user && clerkUser?.emailAddresses[0]?.emailAddress === "kushtrim@promnestria.biz") {
        try {
          await ensureSuperAdmin({ userId });
        } catch (error) {
          logger.error("Error creating super admin:", error);
        }
      }
    };

    initializeUser();
  }, [isSignedIn, userId, user, clerkUser, ensureSuperAdmin]);

  const handleDashboardClick = async () => {
    if (!isSignedIn || !userId) return;

    try {
      // Check if user is super admin by email
      const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;
      if (userEmail === "kushtrim@promnestria.biz") {
        router.push("/admin/dashboard");
        return;
      }

      // For other users, check their role
      if (user) {
        if (user.role === "org_admin") {
          router.push(`/organizations/${user.organizationId}`);
        } else if (user.role === "team_leader" || user.role === "team_member") {
          router.push("/teams");
        }
      }
    } catch (error) {
      logger.error("Error navigating to dashboard:", error);
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
          <Button asChild size="lg">
            <Link href="/get-started">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {isSignedIn ? (
          <Button size="lg" onClick={handleDashboardClick}>
            Go to Dashboard
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
} 