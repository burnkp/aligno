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

export const Pricing = () => {
  return (
    <section className="py-24 bg-purple-600" id="pricing">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-up">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Choose the perfect plan for your team's needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name}
              className={`relative bg-white animate-fade-up ${plan.isPopular ? 'border-purple-400 shadow-xl' : ''}`}
              style={{ animationDelay: `${plan.delay}s` }}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="bg-purple-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/per month</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full mt-8 ${
                    plan.isPopular 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                  }`}
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