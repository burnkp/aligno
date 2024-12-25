"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, LineChart } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Set Strategic Goals",
    description: "Define your organization&apos;s objectives and key results with our strategic planning framework.",
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
    <section className="relative py-24 overflow-hidden" id="how-it-works">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-card-gradient opacity-50" />
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple-600 via-brand-purple-500 to-blue-600">
              How Aligno Works
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Transform your organization&apos;s performance in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-purple-200 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-purple-200 to-transparent animate-pulse" />
          </div>

          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative animate-fade-up"
              style={{ animationDelay: `${step.delay}s` }}
            >
              <Card className="group relative border-gray-100 hover:border-brand-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple-500/5 overflow-hidden">
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardContent className="relative p-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-brand-purple-600 text-white flex items-center justify-center text-2xl font-bold transform group-hover:scale-110 transition-transform duration-300">
                        {step.number}
                      </div>
                      {/* Decorative Ring */}
                      <div className="absolute -inset-2 border-2 border-brand-purple-200/50 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-3xl bg-brand-purple-50 flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <step.icon className="w-10 h-10 text-brand-purple-600" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-brand-purple-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Connection Line */}
              {index < steps.length - 1 && (
                <div className="md:hidden w-0.5 h-8 bg-gradient-to-b from-brand-purple-200 to-transparent mx-auto my-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 