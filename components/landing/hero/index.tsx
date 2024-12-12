"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export const Hero = () => {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });

  const handleDashboardNavigation = async () => {
    if (!isSignedIn || !userId) return;

    try {
      const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;
      if (userEmail === "kushtrim@promnestria.biz") {
        router.push("/admin/dashboard");
        return;
      }

      if (user) {
        if (user.role === "org_admin") {
          router.push(`/organizations/${user.organizationId}`);
        } else if (user.role === "team_leader" || user.role === "team_member") {
          router.push("/teams");
        }
      }
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
    }
  };

  const handleGetStarted = () => {
    router.push("/get-started");
  };

  const handleWatchDemo = () => {
    // Placeholder for future demo video functionality
    // Will be connected to demo video link later
    return;
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div 
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30"
        style={{
          maskImage: 'linear-gradient(to bottom, white, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, white, transparent)',
        }}
      />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 animate-fade-up">
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-brand-purple-600 via-brand-purple-500 to-blue-600">
              Transform Your Company's Performance
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Align teams, track goals, and drive success with our innovative performance management platform.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-up" 
            style={{ animationDelay: "0.3s" }}
          >
            {isSignedIn ? (
              <Button 
                size="lg"
                className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-8 h-14 text-lg group shadow-lg shadow-brand-purple-500/25 hover:shadow-xl hover:shadow-brand-purple-500/30 transition-all duration-300"
                onClick={handleDashboardNavigation}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg"
                  className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-8 h-14 text-lg group shadow-lg shadow-brand-purple-500/25 hover:shadow-xl hover:shadow-brand-purple-500/30 transition-all duration-300"
                  onClick={handleGetStarted}
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-purple-200 text-brand-purple-600 hover:bg-brand-purple-50 h-14 text-lg group transition-all duration-300"
                  onClick={handleWatchDemo}
                >
                  <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Watch Demo
                </Button>
              </>
            )}
          </div>

          {!isSignedIn && (
            <div 
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm text-gray-600 animate-fade-up" 
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-2 group">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-brand-purple-600 transition-transform group-hover:scale-110">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
                </svg>
                <span className="group-hover:text-brand-purple-600 transition-colors">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 group">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-brand-purple-600 transition-transform group-hover:scale-110">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
                </svg>
                <span className="group-hover:text-brand-purple-600 transition-colors">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 group">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-brand-purple-600 transition-transform group-hover:scale-110">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
                </svg>
                <span className="group-hover:text-brand-purple-600 transition-colors">Cancel anytime</span>
              </div>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            Trusted by leading companies worldwide
          </p>
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50 hover:opacity-75 transition-opacity duration-300 animate-fade-up" 
            style={{ animationDelay: "0.6s" }}
          >
            <Image src="/logos/amazon.svg" alt="Amazon" width={120} height={32} className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300" />
            <Image src="/logos/google.svg" alt="Google" width={120} height={32} className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300" />
            <Image src="/logos/netflix.svg" alt="Netflix" width={120} height={32} className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300" />
            <Image src="/logos/ibm.svg" alt="IBM" width={120} height={32} className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}; 