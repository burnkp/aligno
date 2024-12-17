import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: 29,
    period: "per user/month",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 team members",
      "Basic OKR tracking",
      "Performance dashboards",
      "Email support",
      "Mobile app access",
      "Basic integrations"
    ]
  },
  {
    name: "Professional",
    price: 79,
    period: "per user/month",
    description: "Ideal for growing organizations",
    popular: true,
    features: [
      "Up to 50 team members",
      "Advanced OKR management",
      "Custom dashboards",
      "Priority support",
      "Advanced analytics",
      "All integrations",
      "Team performance insights",
      "Goal alignment tools"
    ]
  },
  {
    name: "Enterprise",
    price: 199,
    period: "per user/month",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited team members",
      "Custom implementation",
      "24/7 dedicated support",
      "Advanced security features",
      "Custom integrations",
      "AI-powered insights",
      "Executive dashboard",
      "Priority feature access",
      "SLA guarantees"
    ]
  }
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600 to-indigo-700 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-purple-100">
            Choose the perfect plan for your team's needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl bg-white shadow-lg border ${
                plan.popular ? 'border-purple-400' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-600">
                    <Check className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
                }`}
                size="lg"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};