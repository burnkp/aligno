"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");

  // If we have email and orgName, ensure they're passed to the redirect URL
  let finalRedirectUrl = redirectUrl || "/dashboard";
  if (redirectUrl === "/auth/setup" && email && orgName) {
    const setupUrl = new URL("/auth/setup", window.location.origin);
    setupUrl.searchParams.set("email", email);
    setupUrl.searchParams.set("orgName", orgName);
    finalRedirectUrl = setupUrl.toString();
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-none",
          },
        }}
        redirectUrl={finalRedirectUrl}
        initialValues={{
          emailAddress: email || "",
        }}
      />
    </div>
  );
}