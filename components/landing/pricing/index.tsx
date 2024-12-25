"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: "29",
    features: [
      "Up to 10 team members",
      "Basic OKR tracking",
      "Performance dashboards",
      "Email support",
      "Mobile app access",
      "Basic integrations",
    ],
    buttonText: "Get Started",
    delay: 0.1,
  },
  {
    name: "Professional",
    description: "Ideal for growing organizations",
    price: "79",
    isPopular: true,
    features: [
      "Up to 50 team members",
      "Advanced OKR management",
      "Custom dashboards",
      "Priority support",
      "Advanced analytics",
      "AI integrations",
      "Team performance insights",
      "Goal alignment tools",
    ],
    buttonText: "Get Started",
    delay: 0.2,
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: "199",
    features: [
      "Unlimited team members",
      "Custom implementation",
      "24/7 dedicated support",
      "Advanced security features",
      "Custom integrations",
      "AI-powered insights",
      "Executive dashboard",
      "Priority feature access",
      "SLA guarantees",
    ],
    buttonText: "Get Started",
    delay: 0.3,
  },
];

// Add handlePricingClick function
const handlePricingClick = () => {
  // Placeholder for future payment system integration
  return;
};

export const Pricing = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="pricing">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-brand-purple-600" />
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 grid-background bg-center opacity-10"
        style={{
          maskImage: 'linear-gradient(to bottom, white, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, white, transparent)',
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-up">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-brand-purple-100 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Choose the perfect plan for your team&apos;s needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name}
              className={`group relative bg-white animate-fade-up hover:shadow-xl hover:shadow-brand-purple-500/10 transition-all duration-300 ${
                plan.isPopular ? 'border-brand-purple-400 shadow-lg scale-105 md:scale-110' : ''
              }`}
              style={{ animationDelay: `${plan.delay}s` }}
            >
              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="bg-brand-purple-600 text-white text-sm font-medium px-6 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="relative p-8">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-brand-purple-600 transition-colors duration-300">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500 ml-2">/per month</span>
                </div>
              </CardHeader>

              <CardContent className="relative p-8 pt-0">
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 group/item"
                      style={{ animationDelay: `${plan.delay + (index * 0.05)}s` }}
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-gray-600 group-hover/item:text-gray-900 transition-colors duration-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full mt-8 h-12 text-base font-medium transition-all duration-300 ${
                    plan.isPopular 
                      ? 'bg-brand-purple-600 hover:bg-brand-purple-700 text-white shadow-lg shadow-brand-purple-500/25 hover:shadow-xl hover:shadow-brand-purple-500/30' 
                      : 'bg-white border-2 border-brand-purple-200 text-brand-purple-600 hover:bg-brand-purple-50 hover:border-brand-purple-300'
                  }`}
                  onClick={handlePricingClick}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}; 