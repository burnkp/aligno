"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Set Strategic Goals",
    description: "Define your organization's objectives and key results with our strategic planning framework.",
    icon: Target,
    delay: 0.1,
  },
  {
    number: "02",
    title: "Align Teams",
    description: "Cascade goals throughout your organization, ensuring every team understands their objectives.",
    icon: Users,
    delay: 0.2,
  },
  {
    number: "03",
    title: "Track Progress",
    description: "Monitor performance in real-time with automated tracking and progress analytics.",
    icon: LineChart,
    delay: 0.3,
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4 animate-fade-up">
            How Aligno Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Transform your organization's performance in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100" />

          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative animate-fade-up"
              style={{ animationDelay: `${step.delay}s` }}
            >
              <Card className="border-purple-100 hover:border-purple-200 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-6">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
                      <step.icon className="w-8 h-8 text-purple-600" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 