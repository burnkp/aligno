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
    return <div>Loading dependencies...</div>;
  }

  const availableObjectives = objectives.filter(
    (obj) =>
      obj._id !== objectiveId &&
      !dependencies.some((dep) => dep._id === obj._id) &&
      obj.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (selectedId: Id<"strategicObjectives">) => {
    await addDependency({
      objectiveId,
      dependsOnId: selectedId,
    });
    setOpen(false);
    setSearchQuery("");
  };

  const handleRemove = async (dependencyId: Id<"strategicObjectives">) => {
    await removeDependency({
      objectiveId,
      dependsOnId: dependencyId,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
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
              {availableObjectives.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-2">
                  No objectives found
                </div>
              ) : (
                <div className="space-y-2">
                  {availableObjectives.map((objective) => (
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

      <div className="space-y-2">
        {dependencies.map((dependency) => (
          <div
            key={dependency._id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <span>{dependency.title}</span>
              <Badge variant="secondary">
                {Math.round(dependency.progress || 0)}%
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(dependency._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}; 