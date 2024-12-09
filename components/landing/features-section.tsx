"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BarChart,
  Shield,
  Zap,
  Clock,
  Lock,
} from "lucide-react";

const features = [
  {
    title: "Team Management",
    description:
      "Create and manage teams with ease. Assign roles, track progress, and collaborate effectively.",
    icon: Users,
  },
  {
    title: "Real-time Analytics",
    description:
      "Get insights into your organization's performance with detailed analytics and reporting.",
    icon: BarChart,
  },
  {
    title: "Enterprise Security",
    description:
      "Advanced security features to protect your organization's data and maintain compliance.",
    icon: Shield,
  },
  {
    title: "Fast Performance",
    description:
      "Built with modern technology for lightning-fast performance and real-time updates.",
    icon: Zap,
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock support to help you with any questions or issues you may have.",
    icon: Clock,
  },
  {
    title: "Data Privacy",
    description:
      "Your data is encrypted and securely stored with strict access controls and policies.",
    icon: Lock,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to manage your organization
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 