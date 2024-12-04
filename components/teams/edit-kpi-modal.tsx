"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EditKPIModalProps {
  kpi: any; // Replace with proper KPI type
  isOpen: boolean;
  onClose: () => void;
}

export function EditKPIModal({ kpi, isOpen, onClose }: EditKPIModalProps) {
  const { toast } = useToast();
  const updateKPI = useMutation(api.kpis.update);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentValue: kpi.currentValue,
    targetValue: kpi.targetValue,
    description: kpi.description,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateKPI({
        id: kpi._id,
        ...formData,
      });

      toast({
        title: "KPI updated",
        description: "The KPI has been successfully updated.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update KPI. Please try again.",
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
          <DialogTitle>Update KPI: {kpi.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentValue">Current Value</Label>
            <Input
              id="currentValue"
              type="number"
              value={formData.currentValue}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                currentValue: parseFloat(e.target.value)
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value</Label>
            <Input
              id="targetValue"
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targetValue: parseFloat(e.target.value)
              }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update KPI"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 