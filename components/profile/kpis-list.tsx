"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Edit2, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface KPIsListProps {
  kpis: any[];
  canEdit: boolean;
}

export function KPIsList({ kpis, canEdit }: KPIsListProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  const updateKPI = useMutation(api.kpis.update);

  const handleEdit = (kpi: any) => {
    setEditingId(kpi._id);
    setEditValue(kpi.currentValue.toString());
  };

  const handleSave = async (kpi: any) => {
    try {
      await updateKPI({
        kpiId: kpi._id,
        currentValue: parseFloat(editValue),
      });
      
      setEditingId(null);
      toast({
        title: "KPI Updated",
        description: "The KPI value has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update KPI value.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Key Performance Indicators</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi._id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {editingId === kpi._id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSave(kpi)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span>
                        Current: {kpi.currentValue} / {kpi.targetValue}
                      </span>
                      {canEdit && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(kpi)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <Progress
                  value={(kpi.currentValue / kpi.targetValue) * 100}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(kpi.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 