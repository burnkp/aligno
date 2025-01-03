"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import logger from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  const router = useRouter();
  const { isSignedIn, userId, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const user = useQuery(api.users.getUser, { userId: userId ?? "" });

  const handleDashboardNavigation = () => {
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
      logger.error("Error navigating to dashboard:", error);
    }
  };

  const renderAuthButtons = () => {
    if (!isLoaded) return null;

    if (isSignedIn) {
      return (
        <Button 
          onClick={handleDashboardNavigation}
          size="lg"
          className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white transition-colors duration-200"
        >
          Go to Dashboard
        </Button>
      );
    }

    return (
      <>
        <Link href="/get-started" passHref>
          <Button 
            size="lg"
            className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white transition-colors duration-200"
            asChild
          >
            <span>Start Free Trial</span>
          </Button>
        </Link>
        <SignInButton mode="modal">
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-200 hover:border-brand-purple-600 hover:text-brand-purple-600 transition-colors duration-200"
          >
            Sign In
          </Button>
        </SignInButton>
      </>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-10 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple-50/50 via-white to-blue-50/50 -z-10" />
      
      {/* Main content */}
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 max-w-4xl animate-fade-in">
        Transform Your Company&apos;s Performance
      </h1>
      
      <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl animate-fade-in animation-delay-200">
        Align teams, track goals, and drive success with our innovative performance management platform.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in animation-delay-400">
        {renderAuthButtons()}
      </div>

      {/* Social proof section */}
      <div className="animate-fade-in animation-delay-600">
        <p className="text-gray-500 mb-6">
          Trusted by leading companies worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <Image 
            src="/assets/companies/google.svg" 
            alt="Google" 
            width={100} 
            height={40} 
            className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
          />
          <Image 
            src="/assets/companies/amazon.svg" 
            alt="Amazon" 
            width={100} 
            height={40} 
            className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
          />
          <Image 
            src="/assets/companies/netflix.svg" 
            alt="Netflix" 
            width={90} 
            height={40} 
            className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
          />
          <Image 
            src="/assets/companies/ibm.svg" 
            alt="IBM" 
            width={90} 
            height={40} 
            className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}; 