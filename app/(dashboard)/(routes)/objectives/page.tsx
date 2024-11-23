"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { ObjectiveCard } from "@/components/objectives/objective-card";
import { CreateObjectiveModal } from "@/components/objectives/create-objective-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeline } from "@/components/objectives/timeline";

export default function ObjectivesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives);
  const teams = useQuery(api.teams.getTeams);
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults);

  const timelineItems = [
    ...(objectives?.map(obj => ({
      type: "objective" as const,
      id: obj._id,
      title: obj.title,
      startDate: new Date(obj.startDate),
      endDate: new Date(obj.endDate),
      progress: obj.progress,
    })) || []),
    ...(okrs?.map(okr => ({
      type: "okr" as const,
      id: okr._id,
      title: okr.title,
      startDate: new Date(okr.startDate),
      endDate: new Date(okr.endDate),
      progress: okr.progress,
      objectiveId: okr.strategicObjectiveId,
    })) || []),
  ].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Strategic Objectives</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Objective
        </Button>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives?.map((objective) => (
              <ObjectiveCard 
                key={objective._id} 
                objective={objective}
                team={teams?.find(team => team._id === objective.teamId)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <Timeline items={timelineItems} />
        </TabsContent>
      </Tabs>

      <CreateObjectiveModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        teams={teams || []}
      />
    </div>
  );
}