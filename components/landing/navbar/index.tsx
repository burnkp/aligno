"use client";

import { Button } from "@/components/ui/button";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });

  const handleNavigation = () => {
    if (!isSignedIn || !userId) return;

    try {
      // Check if user is super admin by email
      const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;
      if (userEmail === "kushtrim@promnestria.biz") {
        router.push("/admin/dashboard");
        return;
      }

      // For other users, check their role
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Aligno
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <Button 
                onClick={handleNavigation}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Button>
                </SignInButton>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => router.push("/get-started")}
                >
                  Start Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  <a href="#features" className="text-lg hover:text-gray-900 transition-colors">Features</a>
                  <a href="#how-it-works" className="text-lg hover:text-gray-900 transition-colors">How it Works</a>
                  <a href="#pricing" className="text-lg hover:text-gray-900 transition-colors">Pricing</a>
                  <a href="#faq" className="text-lg hover:text-gray-900 transition-colors">FAQ</a>
                  
                  <div className="flex flex-col gap-4 mt-4">
                    {isSignedIn ? (
                      <Button 
                        onClick={handleNavigation}
                        className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                      >
                        Go to Dashboard
                      </Button>
                    ) : (
                      <>
                        <SignInButton mode="modal">
                          <Button variant="ghost" className="text-gray-600 hover:text-gray-900 w-full">
                            Sign In
                          </Button>
                        </SignInButton>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                          onClick={() => router.push("/get-started")}
                        >
                          Start Free
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}; 