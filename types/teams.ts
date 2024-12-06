import { Id } from "@/convex/_generated/dataModel";
import { Role } from "@/utils/permissions";

export interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: Role;
  joinedAt?: string;
}

export interface Team {
  _id: Id<"teams">;
  _creationTime: number;
  name: string;
  description?: string;
  createdBy: string;
  members: TeamMember[];
  visibility?: "private" | "public";
  allowedDomains?: string[];
} 