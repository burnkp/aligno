"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });

  // Handle loading state
  if (!isUserLoaded || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated or not super admin
  const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!isSignedIn || userEmail !== SUPER_ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="h-screen flex dark:bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
} 