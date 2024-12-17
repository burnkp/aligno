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
    color: "text-brand-purple-500",
    bgColor: "bg-brand-purple-50",
    delay: 0.1,
  },
  {
    title: "Performance Analytics",
    description: "Track progress with real-time dashboards and comprehensive performance metrics.",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    delay: 0.2,
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade security features ensuring your strategic data remains protected.",
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    delay: 0.3,
  },
  {
    title: "Agile Performance",
    description: "Adapt quickly with real-time updates and flexible goal management.",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    delay: 0.4,
  },
  {
    title: "Continuous Support",
    description: "24/7 expert support to help you achieve your strategic objectives.",
    icon: HeadphonesIcon,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    delay: 0.5,
  },
  {
    title: "Data Protection",
    description: "Advanced encryption and compliance measures for your sensitive data.",
    icon: Lock,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    delay: 0.6,
  },
];

export const Features = () => {
  return (
    <section className="relative py-20 overflow-hidden" id="features">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-card-gradient opacity-50" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple-600 via-brand-purple-500 to-blue-600">
              Everything you need for strategic excellence
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and features designed to drive organizational success and maintain perfect alignment across teams.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group relative border border-gray-100 hover:border-brand-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple-500/5 animate-fade-up overflow-hidden"
              style={{ animationDelay: `${feature.delay}s` }}
            >
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="relative p-8">
                <div 
                  className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color} transform group-hover:rotate-12 transition-transform duration-300`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-brand-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 