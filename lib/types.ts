import { Id } from "@/convex/_generated/dataModel";

export interface Milestone {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  weight: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StrategicObjective {
  _id: Id<"strategicObjectives">;
  title: string;
  description: string;
  teamId: Id<"teams">;
  createdBy: string;
  progress: number;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  dependencies: Id<"strategicObjectives">[];
  updatedAt: string;
}

export interface Node {
  id: string;
  name: string;
  progress: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface Link {
  source: string;
  target: string;
} 