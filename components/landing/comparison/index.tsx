"use client";

import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const oldWayPoints = [
  "Annual performance reviews that feel outdated the moment they're complete",
  "Siloed departments with misaligned objectives",
  "Manual tracking and reporting leading to delays and errors",
];

const alignoWayPoints = [
  "Real-time performance tracking and continuous feedback loops",
  "Seamless alignment of goals across all organizational levels",
  "Automated tracking with AI-powered insights and recommendations",
];

export const Comparison = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="comparison">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-brand-purple-600" />
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"
        style={{
          maskImage: 'linear-gradient(to bottom, white, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, white, transparent)',
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="absolute -left-64 w-96 h-96 bg-brand-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -right-64 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-up">
            The Old Way vs The Aligno Way
          </h2>
          <p className="text-lg text-brand-purple-100 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            See how Aligno transforms traditional performance management into a dynamic, results-driven process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Old Way */}
          <Card 
            className="group bg-brand-purple-700/50 border-brand-purple-500/20 p-8 backdrop-blur-sm animate-fade-up hover:bg-brand-purple-700/60 transition-all duration-300" 
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-brand-purple-500/20 rounded-lg px-4 py-2">The Old Way</span>
            </h3>
            <div className="space-y-6">
              {oldWayPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 group/item"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-brand-purple-100 group-hover/item:text-white transition-colors duration-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* The Aligno Way */}
          <Card 
            className="group bg-white p-8 animate-fade-up hover:shadow-xl hover:shadow-brand-purple-500/10 transition-all duration-300" 
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-xl font-semibold text-brand-purple-600 mb-6 flex items-center">
              <span className="bg-brand-purple-50 rounded-lg px-4 py-2">The Aligno Way</span>
            </h3>
            <div className="space-y-6">
              {alignoWayPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 group/item"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-gray-600 group-hover/item:text-brand-purple-600 transition-colors duration-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}; 