"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");

  // Always redirect to auth-callback after sign-in
  const finalRedirectUrl = "/auth-callback";

  // Construct the complete redirect URL with all parameters
  const completeRedirectUrl = new URL(finalRedirectUrl, window.location.origin);
  if (email) completeRedirectUrl.searchParams.set("email", email);
  if (orgName) completeRedirectUrl.searchParams.set("orgName", orgName);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-none",
          },
          layout: {
            socialButtonsPlacement: "top",
            showOptionalFields: false
          }
        }}
        afterSignInUrl={completeRedirectUrl.toString()}
        signUpUrl="/sign-up"
      />
    </div>
  );
}