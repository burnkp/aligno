"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Shield,
  Zap,
  Users,
  HeadphonesIcon,
  Lock,
} from "lucide-react";

const features = [
  {
    title: "Strategic Team Alignment",
    description: "Align your entire organization with cascading objectives and clear accountability structures.",
    icon: Users,
    color: "text-purple-500",
    delay: 0.1,
  },
  {
    title: "Performance Analytics",
    description: "Track progress with real-time dashboards and comprehensive performance metrics.",
    icon: BarChart3,
    color: "text-blue-500",
    delay: 0.2,
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade security features ensuring your strategic data remains protected.",
    icon: Shield,
    color: "text-green-500",
    delay: 0.3,
  },
  {
    title: "Agile Performance",
    description: "Adapt quickly with real-time updates and flexible goal management.",
    icon: Zap,
    color: "text-yellow-500",
    delay: 0.4,
  },
  {
    title: "Continuous Support",
    description: "24/7 expert support to help you achieve your strategic objectives.",
    icon: HeadphonesIcon,
    color: "text-pink-500",
    delay: 0.5,
  },
  {
    title: "Data Protection",
    description: "Advanced encryption and compliance measures for your sensitive data.",
    icon: Lock,
    color: "text-indigo-500",
    delay: 0.6,
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Everything you need for strategic excellence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and features designed to drive organizational success and maintain perfect alignment across teams.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${feature.delay}s` }}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 