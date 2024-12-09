"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded } = useAuth();
  const user = useQuery(api.users.getUser, {
    userId: userId ?? "",
  });

  // Show loading state
  if (!isLoaded || user === undefined) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated or not super admin
  if (!userId || user?.role !== "super_admin") {
    redirect("/");
  }

  return (
    <div className="h-screen">
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>
      <main className="md:pl-72 h-full">
        <div className="h-full px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
} 