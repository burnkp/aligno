"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

interface TemplateSelectorProps {
  type: "objective" | "okr" | "kpi";
  onSelect: (template: any) => void;
}

export const TemplateSelector = ({ type, onSelect }: TemplateSelectorProps) => {
  const templates = useQuery(api.templates.getTemplates, { type });
  const [selectedId, setSelectedId] = useState<string>("");

  if (!templates) {
    return <div>Loading templates...</div>;
  }

  const selectedTemplate = templates.find(
    (template) => template._id === selectedId
  );

  const handleSelect = (value: string) => {
    setSelectedId(value);
    const template = templates.find((t) => t._id === value);
    if (template) {
      onSelect(template);
    }
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleSelect} value={selectedId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template._id} value={template._id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate.name}</CardTitle>
            <CardDescription>{selectedTemplate.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Template Fields:</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedTemplate.fields.map((field: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="font-medium">{field.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Type: {field.type}
                      {field.required && " (Required)"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 