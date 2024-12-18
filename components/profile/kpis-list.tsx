"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
const logger = require("../../logger");

interface KPIsListProps {
  objectiveId: Id<"strategicObjectives">;
}

export function KPIsList({ objectiveId }: KPIsListProps) {
  const kpis = useQuery(api.kpis.getKPIsByObjective, {
    objectiveId,
  });

  const [editingId, setEditingId] = useState<Id<"kpis"> | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  const updateKPI = useMutation(api.kpis.updateKPI);

  const handleEdit = (kpi: any) => {
    setEditingId(kpi._id);
    setEditValue(kpi.currentValue.toString());
  };

  const handleSave = async (kpi: any) => {
    try {
      await updateKPI({
        kpiId: kpi._id,
        updates: {
          currentValue: parseFloat(editValue),
        },
      });
      setEditingId(null);
      setEditValue("");
    } catch (error) {
      logger.error("Failed to update KPI:", error);
    }
  };

  if (!kpis) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {kpis.map((kpi) => (
            <div key={kpi._id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{kpi.title}</h4>
                  <p className="text-sm text-muted-foreground">{kpi.description}</p>
                </div>
                <Badge>{kpi.status}</Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Progress value={(kpi.currentValue / kpi.targetValue) * 100} />
                </div>
                
                {editingId === kpi._id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-24"
                    />
                    <Button size="sm" onClick={() => handleSave(kpi)}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {kpi.currentValue} / {kpi.targetValue}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(kpi)}>
                      Update
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 