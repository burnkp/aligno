"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

function SetupContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const orgName = searchParams.get("orgName");

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/50">
      <Card className="w-[90%] max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Setup</CardTitle>
          <CardDescription>
            You&apos;re almost there! Please complete your account setup to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Organization: <span className="font-medium text-foreground">{orgName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Email: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              Click below to set up your account and access your organization&apos;s dashboard.
            </p>
          </div>
          <SignInButton mode="modal" redirectUrl={`/auth-callback?email=${encodeURIComponent(email || '')}&orgName=${encodeURIComponent(orgName || '')}`}>
            <Button className="w-full">
              Complete Setup
            </Button>
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-muted/50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
} 