import { Id } from "@/convex/_generated/dataModel";

export type OrganizationId = Id<"organizations"> | "SYSTEM" | undefined;

export type Role = "super_admin" | "org_admin" | "team_leader" | "team_member" | "pending";

export interface User {
  _id: Id<"users">;
  userId: string;
  email: string;
  name: string;
  imageUrl?: string;
  role: Role;
  organizationId?: OrganizationId;
  createdAt: string;
  updatedAt: string;
} 