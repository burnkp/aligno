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
    <section className="py-24 bg-purple-600" id="comparison">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-up">
            The Old Way vs The Aligno Way
          </h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            See how Aligno transforms traditional performance management into a dynamic, results-driven process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* The Old Way */}
          <Card className="bg-purple-700/50 border-purple-500/20 p-8 backdrop-blur-sm animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-semibold text-white mb-6">The Old Way</h3>
            <div className="space-y-4">
              {oldWayPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <span className="text-purple-100">{point}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* The Aligno Way */}
          <Card className="bg-white p-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-xl font-semibold text-purple-600 mb-6">The Aligno Way</h3>
            <div className="space-y-4">
              {alignoWayPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">{point}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}; 