"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import logger from "@/utils/logger";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");
  const redirectUrl = searchParams.get("redirect_url");

  // Build the complete redirect URL with all necessary parameters
  const completeRedirectUrl = new URL("/auth-callback", window.location.origin);
  
  // Preserve all search parameters
  searchParams.forEach((value, key) => {
    completeRedirectUrl.searchParams.set(key, value);
  });

  logger.info("Sign In Page Loaded", {
    email,
    orgName,
    redirectUrl: completeRedirectUrl.toString(),
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
        redirectUrl={completeRedirectUrl.toString()}
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