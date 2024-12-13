"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const router = useRouter();
  const { isSignedIn, userId, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = () => {
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

  const renderAuthButtons = () => {
    if (!isLoaded) return null;

    if (isSignedIn) {
      return (
        <>
          <Button 
            onClick={handleNavigation}
            className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white transition-colors duration-200"
          >
            Go to Dashboard
          </Button>
          <SignOutButton>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-brand-purple-600 hover:bg-brand-purple-50 transition-all duration-200"
            >
              Sign Out
            </Button>
          </SignOutButton>
        </>
      );
    }

    return (
      <>
        <SignInButton mode="modal">
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-brand-purple-600 hover:bg-brand-purple-50 transition-all duration-200"
          >
            Sign In
          </Button>
        </SignInButton>
        <Link href="/get-started">
          <Button 
            className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white transition-colors duration-200"
          >
            Start Free
          </Button>
        </Link>
      </>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/assets/icons/Aligno Icon.png" 
              alt="Aligno Icon" 
              width={28} 
              height={28} 
              className="h-7 w-auto" 
              priority
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-purple-600 to-blue-600 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              Aligno
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a 
              href="#features" 
              className="text-gray-600 hover:text-brand-purple-600 transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-600 hover:text-brand-purple-600 transition-colors duration-200"
            >
              How it Works
            </a>
            <a 
              href="#pricing" 
              className="text-gray-600 hover:text-brand-purple-600 transition-colors duration-200"
            >
              Pricing
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {renderAuthButtons()}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-brand-purple-50 transition-colors duration-200"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right"
                className="w-[300px] sm:w-[400px] border-l border-gray-100"
              >
                <div className="flex flex-col gap-6 mt-8">
                  <a 
                    href="#features" 
                    className="text-lg text-gray-600 hover:text-brand-purple-600 transition-colors duration-200"
                  >
                    Features
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="text-lg text-gray-600 hover:text-brand-purple-600 transition-colors duration-200"
                  >
                    How it Works
                  </a>
                  <a 
                    href="#pricing" 
                    className="text-lg text-gray-600 hover:text-brand-purple-600 transition-colors duration-200"
                  >
                    Pricing
                  </a>
                  
                  <div className="flex flex-col gap-4 mt-4">
                    {renderAuthButtons()}
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