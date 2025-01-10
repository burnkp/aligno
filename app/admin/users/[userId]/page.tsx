"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Calendar,
  Shield,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { EditUserModal } from "@/components/admin/edit-user-modal";
import { OrganizationId } from "@/types";

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const user = useQuery(api.users.getUser, { userId });
  const organizations = useQuery(api.organizations.getAllOrganizations);

  const getOrganizationName = (organizationId: OrganizationId) => {
    if (organizationId === "SYSTEM") return "System";
    if (!organizationId) return "N/A";
    const organization = organizations?.find((org) => org._id === organizationId);
    return organization?.name ?? "N/A";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "org_admin":
        return "bg-blue-100 text-blue-800";
      case "team_leader":
        return "bg-green-100 text-green-800";
      case "team_member":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Role:</span>
              <Badge
                variant="secondary"
                className={getRoleBadgeColor(user.role)}
              >
                {user.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Organization:</span>
              <span>{getOrganizationName(user.organizationId)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <p className="text-muted-foreground">No recent activity</p>
            </Card>
          </TabsContent>
          <TabsContent value="teams" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Memberships</h3>
              <p className="text-muted-foreground">No team memberships</p>
            </Card>
          </TabsContent>
          <TabsContent value="permissions" className="mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Current role: <Badge>{user.role}</Badge>
                </p>
                <p className="text-muted-foreground">
                  Permissions for this role will be displayed here
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userId={userId}
        initialData={{
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        }}
      />
    </div>
  );
} 