"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node as ReactFlowNode,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

interface Objective {
  _id: Id<"strategicObjectives">;
  title: string;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  progress: number;
}

interface Dependencies {
  sourceOf: Array<{
    source: Id<"strategicObjectives">;
    target: Id<"strategicObjectives">;
    type: "blocks" | "depends_on" | "related_to";
  }>;
  targetOf: Array<{
    source: Id<"strategicObjectives">;
    target: Id<"strategicObjectives">;
    type: "blocks" | "depends_on" | "related_to";
  }>;
}

interface ObjectiveNode extends ReactFlowNode {
  id: Id<"strategicObjectives">;
  type: 'objective';
  data: {
    label: string;
    status: "not_started" | "in_progress" | "completed" | "blocked";
    progress: number;
  };
  position: { x: number; y: number };
}

interface DependencyGraphProps {
  objectiveId: Id<"strategicObjectives">;
  objectives?: Objective[];
  dependencies?: Dependencies;
}

export function DependencyGraph({ objectiveId, objectives, dependencies }: DependencyGraphProps) {
  // Create nodes for objectives
  const nodes: ObjectiveNode[] = objectives?.filter(obj => {
    // Include the main objective and any objectives it's connected to
    return obj._id === objectiveId ||
      dependencies?.sourceOf?.some(dep => dep.target === obj._id) ||
      dependencies?.targetOf?.some(dep => dep.source === obj._id);
  }).map(obj => ({
    id: obj._id,
    type: 'objective',
    data: {
      label: obj.title,
      status: obj.status,
      progress: obj.progress,
    },
    position: { x: 0, y: 0 }, // Initial position, will be updated by layout
  })) ?? [];

  // Create edges for dependencies
  const edges = [
    ...(dependencies?.sourceOf?.map(dep => ({
      id: `${dep.source}-${dep.target}`,
      source: dep.source,
      target: dep.target,
      type: dep.type,
    })) ?? []),
    ...(dependencies?.targetOf?.map(dep => ({
      id: `${dep.source}-${dep.target}`,
      source: dep.source,
      target: dep.target,
      type: dep.type,
    })) ?? []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dependency Graph</CardTitle>
        <CardDescription>
          Visualize relationships between objectives
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] border rounded-lg">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
} 