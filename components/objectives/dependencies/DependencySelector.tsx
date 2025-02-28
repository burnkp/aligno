"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DependencySelectorProps {
  objectiveId: Id<"strategicObjectives">;
}

export const DependencySelector = ({ objectiveId }: DependencySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const objective = useQuery(api.strategicObjectives.getStrategicObjective, {
    id: objectiveId,
  });
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const dependencies = useQuery(api.strategicObjectives.getDependencies, {
    objectiveId,
  });
  const addDependency = useMutation(api.strategicObjectives.addDependency);
  const removeDependency = useMutation(api.strategicObjectives.removeDependency);

  if (!objective || !objectives || !dependencies) {
    return null;
  }

  const connectedIds = new Set([
    ...dependencies.sourceOf.map(dep => dep.target),
    ...dependencies.targetOf.map(dep => dep.source)
  ]);

  const filteredObjectives = objectives.filter(
    (obj) =>
      obj._id !== objectiveId &&
      !connectedIds.has(obj._id) &&
      obj.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (selectedId: Id<"strategicObjectives">) => {
    await addDependency({
      sourceId: objectiveId,
      targetId: selectedId,
      type: "depends_on",
    });
    setOpen(false);
  };

  const handleRemove = async (selectedId: Id<"strategicObjectives">) => {
    await removeDependency({
      sourceId: objectiveId,
      targetId: selectedId,
    });
  };

  // Get all dependencies as a flat array
  const allDependencies = [
    ...dependencies.sourceOf.map(dep => ({
      ...dep,
      objective: objectives.find(obj => obj._id === dep.target),
      direction: 'outgoing' as const,
    })),
    ...dependencies.targetOf.map(dep => ({
      ...dep,
      objective: objectives.find(obj => obj._id === dep.source),
      direction: 'incoming' as const,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dependencies</h3>
        <Button onClick={() => setOpen(true)} variant="outline" size="sm">
          Add Dependency
        </Button>
      </div>

      {allDependencies.length === 0 ? (
        <div className="text-sm text-gray-500">No dependencies</div>
      ) : (
        <div className="space-y-2">
          {allDependencies.map((dep) => {
            if (!dep.objective) return null;
            return (
              <div
                key={dep._id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {dep.direction === 'outgoing' ? 'Depends on' : 'Required by'}:
                  </span>
                  <span>{dep.objective.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(
                    dep.direction === 'outgoing' ? dep.target : dep.source
                  )}
                >
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            Add dependency...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-4">
          <div className="space-y-4">
            <div className="flex items-center border rounded-md">
              <Search className="w-4 h-4 mx-2 text-gray-500" />
              <Input
                placeholder="Search objectives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0"
              />
            </div>
            {filteredObjectives.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                No objectives found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredObjectives.map((objective) => (
                  <Button
                    key={objective._id}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => handleSelect(objective._id)}
                  >
                    {objective.title}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}; 