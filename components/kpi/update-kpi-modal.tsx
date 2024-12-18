"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";
import logger from "@/utils/logger";

const formSchema = z.object({
  currentValue: z.number().min(0).max(100),
});

interface KPI {
  _id: Id<"kpis">;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  progress: number;
}

interface UpdateKPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI;
}

export function UpdateKPIModal({ isOpen, onClose, kpi }: UpdateKPIModalProps) {
  const { toast } = useToast();
  const updateKPI = useMutation(api.kpis.updateKPI);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentValue: kpi.currentValue,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      await updateKPI({
        kpiId: kpi._id,
        updates: {
          currentValue: values.currentValue,
        },
      });

      toast({
        title: "Success",
        description: "KPI value updated successfully",
      });

      onClose();
    } catch (error) {
      logger.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update KPI",
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
          <DialogTitle>Update KPI Value</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">{kpi.title}</h3>
              <p className="text-sm text-muted-foreground">{kpi.description}</p>
            </div>

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="100"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Value"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}