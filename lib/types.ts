import { Id } from "@/convex/_generated/dataModel";

export interface Template {
  _id: Id<"templates">;
  name: string;
  description: string;
  type: "objective" | "okr" | "kpi";
  fields: TemplateField[];
  defaultValues?: {
    startDate?: string;
    endDate?: string;
    target?: number;
    unit?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateField {
  name: string;
  type: "text" | "number" | "date" | "select";
  required: boolean;
  options?: string[];
}

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