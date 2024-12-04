"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["objective", "okr", "kpi"]),
  fields: z.array(
    z.object({
      name: z.string().min(1, "Field name is required"),
      type: z.enum(["text", "number", "date", "select"]),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    })
  ),
  defaultValues: z
    .object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      target: z.number().optional(),
      unit: z.string().optional(),
    })
    .optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  type?: "objective" | "okr" | "kpi";
  onClose: () => void;
  onSuccess: () => void;
  initialData?: TemplateFormValues;
}

export const TemplateForm = ({
  type,
  onClose,
  onSuccess,
  initialData,
}: TemplateFormProps) => {
  const createTemplate = useMutation(api.templates.createTemplate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      type: type || "objective",
      fields: [],
      defaultValues: {
        startDate: "",
        endDate: "",
        target: undefined,
        unit: "",
      },
    },
  });

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      setIsSubmitting(true);
      await createTemplate(values);
      onSuccess();
    } catch (error) {
      console.error("Failed to create template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addField = () => {
    const currentFields = form.getValues("fields");
    form.setValue("fields", [
      ...currentFields,
      { name: "", type: "text", required: false },
    ]);
  };

  const removeField = (index: number) => {
    const currentFields = form.getValues("fields");
    form.setValue(
      "fields",
      currentFields.filter((_, i) => i !== index)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Template" : "Create New Template"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="objective">Objective</SelectItem>
                      <SelectItem value="okr">OKR</SelectItem>
                      <SelectItem value="kpi">KPI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Fields</h3>
                <Button type="button" onClick={addField}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {form.watch("fields").map((field, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name={`fields.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Field Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`fields.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Field Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 