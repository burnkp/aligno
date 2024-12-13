"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function AuthSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const updateUserClerkId = useAction(api.mutations.organizations.updateUserClerkId);

  useEffect(() => {
    const setupUser = async () => {
      if (!user) return;

      try {
        const email = searchParams.get("email");
        const orgName = searchParams.get("orgName");

        if (!email || !orgName) {
          console.error("Missing email or organization name");
          router.push("/");
          return;
        }

        // Update user's Clerk ID in Convex
        await updateUserClerkId({
          email,
          clerkId: user.id,
          orgName
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Error during setup:", error);
        router.push("/");
      }
    };

    setupUser();
  }, [user, router, searchParams, updateUserClerkId]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    </div>
  );
} 