"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TemplateForm } from "./TemplateForm";

interface TemplateListProps {
  type?: "objective" | "okr" | "kpi";
  onSelect?: (templateId: string) => void;
}

export const TemplateList = ({ type, onSelect }: TemplateListProps) => {
  const templates = useQuery(api.templates.getTemplates, { type });
  const [isCreating, setIsCreating] = useState(false);

  if (!templates) {
    return <div>Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Templates</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {isCreating && (
        <TemplateForm
          type={type}
          onClose={() => setIsCreating(false)}
          onSuccess={() => setIsCreating(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect?.(template._id)}
          >
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Fields: {template.fields.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Type: {template.type}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 