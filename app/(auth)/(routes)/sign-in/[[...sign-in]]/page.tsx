"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import logger from "@/utils/logger";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");

  // Create state object to preserve context
  const state = {
    email,
    orgName,
    returnTo: "/auth-callback"
  };

  logger.info("Sign In Page Loaded", {
    email,
    orgName,
    state,
    allParams: Object.fromEntries(searchParams.entries())
  });

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "bg-white shadow-md rounded-lg p-8",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          },
          layout: {
            socialButtonsPlacement: "top",
            showOptionalFields: false,
            logoPlacement: "inside",
            logoImageUrl: "/logo.png",
          },
        }}
        afterSignInUrl={`/auth-callback?email=${encodeURIComponent(email || "")}&orgName=${encodeURIComponent(orgName || "")}`}
        signUpUrl="/sign-up"
        path="/sign-in"
        routing="path"
        initialValues={{
          emailAddress: email || "",
        }}
      />
    </div>
  );
}