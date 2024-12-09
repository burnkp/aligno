"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth, useSession } from "@clerk/nextjs";
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
  const { session } = useSession();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });

  // Handle loading state
  if (!user || !session) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated or not super admin
  if (!isSignedIn || session.user.emailAddresses[0].emailAddress !== SUPER_ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="h-screen flex dark:bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
} 