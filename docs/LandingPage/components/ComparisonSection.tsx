import { Check } from "lucide-react";

export const ComparisonSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-600 to-indigo-700 relative overflow-hidden" id="comparison">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            The Old Way vs The Aligno Way
          </h2>
          <p className="text-purple-100">
            See how Aligno transforms traditional performance management into a dynamic, results-driven process
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Old Way */}
          <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-2xl font-semibold mb-6 text-white">The Old Way</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-purple-100">
                <span className="rounded-full bg-red-500/20 p-1">
                  <svg className="w-5 h-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span>Annual performance reviews that feel outdated the moment they're complete</span>
              </li>
              <li className="flex items-start gap-3 text-purple-100">
                <span className="rounded-full bg-red-500/20 p-1">
                  <svg className="w-5 h-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span>Siloed departments with misaligned objectives</span>
              </li>
              <li className="flex items-start gap-3 text-purple-100">
                <span className="rounded-full bg-red-500/20 p-1">
                  <svg className="w-5 h-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span>Manual tracking and reporting leading to delays and errors</span>
              </li>
            </ul>
          </div>

          {/* Aligno Way */}
          <div className="p-8 rounded-2xl bg-white shadow-lg border-2 border-purple-100/20">
            <h3 className="text-2xl font-semibold mb-6 text-purple-600">
              The Aligno Way
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <span className="rounded-full bg-purple-50 p-1">
                  <Check className="w-5 h-5 text-purple-600" />
                </span>
                <span>Real-time performance tracking and continuous feedback loops</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="rounded-full bg-purple-50 p-1">
                  <Check className="w-5 h-5 text-purple-600" />
                </span>
                <span>Seamless alignment of goals across all organizational levels</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <span className="rounded-full bg-purple-50 p-1">
                  <Check className="w-5 h-5 text-purple-600" />
                </span>
                <span>Automated tracking with AI-powered insights and recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};