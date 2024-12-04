"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";

interface DependencyGraphProps {
  objectiveId: Id<"strategicObjectives">;
}

interface Node {
  id: Id<"strategicObjectives">;
  title: string;
  progress: number;
  x: number;
  y: number;
}

interface Link {
  source: Node;
  target: Node;
}

export const DependencyGraph = ({ objectiveId }: DependencyGraphProps) => {
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });
  const dependencies = useQuery(api.strategicObjectives.getDependencies, {
    objectiveId,
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    if (!objective || !dependencies || !svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    // Create nodes with fixed positions in a circle
    const mainNode: Node = {
      id: objective._id,
      title: objective.title,
      progress: objective.progress || 0,
      x: centerX,
      y: centerY,
    };

    const dependencyNodes: Node[] = dependencies.map((dep, index) => {
      const angle = (index * 2 * Math.PI) / dependencies.length;
      return {
        id: dep._id,
        title: dep.title,
        progress: dep.progress || 0,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    const allNodes = [mainNode, ...dependencyNodes];
    const allLinks = dependencyNodes.map((node) => ({
      source: node,
      target: mainNode,
    }));

    setNodes(allNodes);
    setLinks(allLinks);
  }, [objective, dependencies]);

  if (!objective || !dependencies) {
    return <div>Loading dependency graph...</div>;
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "#22c55e";
    if (progress >= 50) return "#eab308";
    if (progress >= 25) return "#f97316";
    return "#ef4444";
  };

  return (
    <svg
      ref={svgRef}
      className="w-full h-[500px] border border-gray-200 rounded-lg"
      style={{ minHeight: "500px" }}
    >
      {/* Draw links */}
      {links.map((link, index) => (
        <line
          key={index}
          x1={link.source.x}
          y1={link.source.y}
          x2={link.target.x}
          y2={link.target.y}
          stroke="#999"
          strokeWidth={2}
          strokeOpacity={0.6}
        />
      ))}

      {/* Draw nodes */}
      {nodes.map((node) => (
        <g key={node.id} transform={`translate(${node.x},${node.y})`}>
          <circle
            r={30}
            fill={getProgressColor(node.progress)}
            stroke="#fff"
            strokeWidth={2}
          />
          <text
            dy=".3em"
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
          >
            {node.progress}%
          </text>
          <title>{node.title}</title>
        </g>
      ))}
    </svg>
  );
}; 