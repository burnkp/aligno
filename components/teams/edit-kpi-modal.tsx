"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import logger from "@/utils/logger";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface KPI {
  _id: Id<"kpis">;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "at_risk";
}

interface EditKPIModalProps {
  kpi: KPI;
  isOpen: boolean;
  onClose: () => void;
}

export function EditKPIModal({ kpi, isOpen, onClose }: EditKPIModalProps) {
  const { toast } = useToast();
  const updateKPI = useMutation(api.kpis.updateKPI);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentValue: kpi.currentValue,
    targetValue: kpi.targetValue,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateKPI({
        kpiId: kpi._id,
        updates: {
          currentValue: formData.currentValue,
          targetValue: formData.targetValue,
        },
      });

      toast({
        title: "Success",
        description: "KPI updated successfully",
      });
      onClose();
    } catch (error) {
      logger.error(error);
      toast({
        title: "Error",
        description: "Failed to update KPI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit KPI: {kpi.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentValue">Current Value</Label>
            <Input
              id="currentValue"
              type="number"
              value={formData.currentValue}
              onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseFloat(e.target.value) }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value</Label>
            <Input
              id="targetValue"
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseFloat(e.target.value) }))}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update KPI"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 