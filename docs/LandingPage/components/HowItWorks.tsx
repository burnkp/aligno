import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Set Strategic Goals",
    description: "Define your organization's objectives and key results with our intuitive goal-setting framework."
  },
  {
    number: "02",
    title: "Align Teams",
    description: "Cascade goals throughout your organization, ensuring every team member understands their role."
  },
  {
    number: "03",
    title: "Track Progress",
    description: "Monitor performance in real-time with automated tracking and insightful analytics."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white relative" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            How Aligno Works
          </h2>
          <p className="text-gray-600">
            Transform your organization's performance in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-200" />
                </div>
              )}
              
              {/* Step content */}
              <div className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="text-4xl font-bold text-purple-600 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};