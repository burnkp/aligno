"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Users, BarChart3, LineChart, Clock, AlertCircle, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateObjectiveModal } from "@/components/objectives/create-objective-modal";
import { CreateOKRModal } from "@/components/okr/create-okr-modal";
import { CreateKPIModal } from "@/components/kpi/create-kpi-modal";
import { SelectParentModal } from "@/components/modals/select-parent-modal";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";

// Add a modern color palette using CSS variables
const styles = {
  gradients: {
    primary: "bg-gradient-to-br from-indigo-500 to-purple-600",
    success: "bg-gradient-to-br from-emerald-500 to-teal-600",
    warning: "bg-gradient-to-br from-amber-500 to-orange-600",
    danger: "bg-gradient-to-br from-rose-500 to-red-600",
  },
  cards: {
    glass: "backdrop-blur-lg bg-white/10 border border-gray-200",
  },
};

export default function DashboardPage() {
  // Add toast hook at the top of the component
  const { toast } = useToast();

  // Modal states
  const [isCreateObjectiveOpen, setIsCreateObjectiveOpen] = useState(false);
  const [isCreateOKROpen, setIsCreateOKROpen] = useState(false);
  const [isCreateKPIOpen, setIsCreateKPIOpen] = useState(false);

  const objectives = useQuery(api.strategicObjectives.getStrategicObjectives, {}) || [];
  const okrs = useQuery(api.operationalKeyResults.getOperationalKeyResults, {}) || [];
  const kpis = useQuery(api.kpis.getKPIs, {}) || [];
  const teams = useQuery(api.teams.getTeams, {}) || [];

  // Calculate summary metrics with type safety
  const totalObjectives = objectives.length;
  const avgObjectiveProgress = objectives.length 
    ? objectives.reduce((acc, obj) => acc + obj.progress, 0) / totalObjectives 
    : 0;
  const upcomingDeadlines = objectives.filter(obj => {
    const endDate = new Date(obj.endDate);
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    return endDate > now && endDate <= sevenDaysFromNow;
  });

  // Add new state for parent selection modals
  const [isSelectObjectiveOpen, setIsSelectObjectiveOpen] = useState(false);
  const [isSelectOKROpen, setIsSelectOKROpen] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<Id<"strategicObjectives"> | null>(null);
  const [selectedOKRId, setSelectedOKRId] = useState<Id<"operationalKeyResults"> | null>(null);

  // Handle parent selection
  const handleObjectiveSelect = (id: Id<"strategicObjectives">) => {
    setSelectedObjectiveId(id);
    setIsSelectObjectiveOpen(false);
    setIsCreateOKROpen(true);
  };

  const handleOKRSelect = (id: Id<"operationalKeyResults">) => {
    setSelectedOKRId(id);
    setIsSelectOKROpen(false);
    setIsCreateKPIOpen(true);
  };

  // Update button click handlers
  const handleAddOKR = () => {
    if (objectives.length === 0) {
      // Show toast or alert that there are no objectives
      return;
    }
    setIsSelectObjectiveOpen(true);
  };

  const handleAddKPI = () => {
    if (okrs.length === 0) {
      toast({
        title: "No Key Results Available",
        description: "Please create a Key Result first before adding KPIs.",
        variant: "destructive",
      });
      return;
    }
    setIsSelectOKROpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section with Action Buttons */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Dashboard Overview
          </h1>
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsCreateObjectiveOpen(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Objective
            </Button>
            <Button
              onClick={handleAddOKR}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Key Result
            </Button>
            <Button
              onClick={handleAddKPI}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add KPI
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${styles.cards.glass} transform hover:scale-105 transition-all duration-300`}>
            <CardHeader className={`${styles.gradients.primary} text-white rounded-t-lg p-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Total Objectives</CardTitle>
                <Target className="h-6 w-6 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{totalObjectives}</div>
              <p className="text-sm text-gray-500 mt-2">
                Across {teams.length} teams
              </p>
            </CardContent>
          </Card>

          <Card className={`${styles.cards.glass} transform hover:scale-105 transition-all duration-300`}>
            <CardHeader className={`${styles.gradients.success} text-white rounded-t-lg p-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Average Progress</CardTitle>
                <BarChart3 className="h-6 w-6 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{avgObjectiveProgress.toFixed(1)}%</div>
              <Progress 
                value={avgObjectiveProgress} 
                className="mt-2"
                style={{
                  background: "rgba(229, 231, 235, 0.5)",
                  borderRadius: "9999px",
                  height: "8px",
                }}
              />
            </CardContent>
          </Card>

          <Card className={`${styles.cards.glass} transform hover:scale-105 transition-all duration-300`}>
            <CardHeader className={`${styles.gradients.warning} text-white rounded-t-lg p-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Upcoming Deadlines</CardTitle>
                <Clock className="h-6 w-6 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{upcomingDeadlines.length}</div>
              <p className="text-sm text-gray-500 mt-2">
                Due within 7 days
              </p>
            </CardContent>
          </Card>

          <Card className={`${styles.cards.glass} transform hover:scale-105 transition-all duration-300`}>
            <CardHeader className={`${styles.gradients.danger} text-white rounded-t-lg p-4`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">At Risk</CardTitle>
                <AlertCircle className="h-6 w-6 opacity-75" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-3xl font-bold">
                {objectives.filter(obj => obj.progress < 25).length}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Less than 25% progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - Spans 2 columns */}
          <Card className={`${styles.cards.glass} lg:col-span-2 transform hover:scale-102 transition-all duration-300`}>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {objectives?.slice(0, 5).map(objective => (
                  <div key={objective._id} 
                    className="flex items-center space-x-4 p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300">
                    <div className={`w-3 h-3 rounded-full ${
                      objective.progress < 25 ? "bg-red-500" :
                      objective.progress < 75 ? "bg-yellow-500" : "bg-green-500"
                    } animate-pulse`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{objective.title}</h4>
                      <p className="text-sm text-gray-500">
                        Due {formatDistanceToNow(new Date(objective.endDate), { addSuffix: true })}
                      </p>
                    </div>
                    <Progress 
                      value={objective.progress} 
                      className="w-24"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "9999px",
                        height: "6px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Progress - Right column */}
          <Card className={`${styles.cards.glass} transform hover:scale-102 transition-all duration-300`}>
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
                Team Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {teams?.map(team => {
                  const teamObjectives = objectives?.filter(obj => obj.teamId === team._id) || [];
                  const avgProgress = teamObjectives.reduce((acc, obj) => acc + obj.progress, 0) / teamObjectives.length || 0;
                  
                  return (
                    <div key={team._id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{team.name}</span>
                        <span className={`px-2 py-1 rounded-full text-sm font-semibold
                          ${avgProgress < 25 ? 'bg-red-100 text-red-800' :
                            avgProgress < 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                          {avgProgress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={avgProgress}
                        className="h-2"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          borderRadius: "9999px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CreateObjectiveModal 
        isOpen={isCreateObjectiveOpen}
        onClose={() => setIsCreateObjectiveOpen(false)}
        teams={teams}
      />

      <SelectParentModal
        isOpen={isSelectObjectiveOpen}
        onClose={() => setIsSelectObjectiveOpen(false)}
        title="Strategic Objective"
        items={objectives}
        onSelect={handleObjectiveSelect}
      />

      <CreateOKRModal 
        isOpen={isCreateOKROpen}
        onClose={() => {
          setIsCreateOKROpen(false);
          setSelectedObjectiveId(null);
        }}
        teams={teams}
        objectiveId={selectedObjectiveId!}
      />

      <SelectParentModal
        isOpen={isSelectOKROpen}
        onClose={() => setIsSelectOKROpen(false)}
        title="Key Result"
        items={okrs}
        onSelect={handleOKRSelect}
      />

      <CreateKPIModal 
        isOpen={isCreateKPIOpen}
        onClose={() => {
          setIsCreateKPIOpen(false);
          setSelectedOKRId(null);
        }}
        teams={teams}
        okrId={selectedOKRId!}
      />
    </div>
  );
}