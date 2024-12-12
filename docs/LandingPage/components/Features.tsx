import { 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  HeadsetIcon, 
  KeyRound 
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Strategic Team Alignment",
    description: "Align your entire organization with cascading objectives and clear accountability structures.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track progress with real-time dashboards and comprehensive performance metrics.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "Bank-grade security features ensuring your strategic data remains protected.",
  },
  {
    icon: Zap,
    title: "Agile Performance",
    description: "Adapt quickly with real-time updates and flexible goal management.",
  },
  {
    icon: HeadsetIcon,
    title: "Continuous Support",
    description: "24/7 expert support to help you achieve your strategic objectives.",
  },
  {
    icon: KeyRound,
    title: "Data Protection",
    description: "Advanced encryption and compliance measures for your sensitive data.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 animate-fade-up bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Everything you need for strategic excellence
        </h2>
        
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto animate-fade-up">
          Comprehensive tools and features designed to drive organizational success and maintain perfect alignment across teams.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};