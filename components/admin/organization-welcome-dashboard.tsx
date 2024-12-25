"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Users,
  Settings,
  FileText,
  ArrowRight,
} from "lucide-react";

interface OrganizationWelcomeDashboardProps {
  organizationId: Id<"organizations">;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  isComplete: boolean;
}

export function OrganizationWelcomeDashboard({
  organizationId,
}: OrganizationWelcomeDashboardProps) {
  const organization = useQuery(api.organizations.getOrganization, {
    organizationId,
  });

  if (!organization) {
    return null;
  }

  const setupSteps: SetupStep[] = [
    {
      id: "team",
      title: "Create Your First Team",
      description: "Set up a team and invite your colleagues",
      href: `/admin/teams/new`,
      icon: Users,
      isComplete: false, // TODO: Check if org has any teams
    },
    {
      id: "settings",
      title: "Configure Organization Settings",
      description: "Customize your organization&apos;s preferences",
      href: `/admin/organizations/${organizationId}/settings`,
      icon: Settings,
      isComplete: false, // TODO: Check if settings are configured
    },
    {
      id: "docs",
      title: "Review Documentation",
      description: "Learn about features and best practices",
      href: `/admin/docs`,
      icon: FileText,
      isComplete: false, // TODO: Track documentation views
    },
  ];

  const completedSteps = setupSteps.filter((step) => step.isComplete).length;
  const progress = (completedSteps / setupSteps.length) * 100;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Welcome to {organization.name}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Let&apos;s get you started with setting up your organization. Follow these
            steps to get the most out of Aligno.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {completedSteps} of {setupSteps.length} complete
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {setupSteps.map((step) => (
          <Card
            key={step.id}
            className={`relative ${
              step.isComplete ? "bg-muted/50" : "hover:border-primary/50"
            }`}
          >
            {step.isComplete && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <CardHeader>
              <step.icon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-lg">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <Button
                variant={step.isComplete ? "outline" : "default"}
                className="w-full"
                asChild
              >
                <a href={step.href}>
                  {step.isComplete ? "View" : "Get Started"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you get started. Check out our
            documentation or contact support if you have any questions.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/admin/docs">View Documentation</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/support">Contact Support</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 