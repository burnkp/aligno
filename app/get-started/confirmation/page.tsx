"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orgName = searchParams.get("orgName");
  const email = searchParams.get("email");

  return (
    <div className="h-screen w-full flex items-center justify-center bg-muted/50">
      <Card className="w-[90%] max-w-md">
        <CardHeader>
          <CardTitle>Organization Created!</CardTitle>
          <CardDescription>
            Your organization has been created successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Organization Name: <span className="font-medium text-foreground">{orgName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Admin Email: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              Please check your email for instructions on how to access your organization&apos;s dashboard.
            </p>
            <p className="text-sm">
              If you haven&apos;t received the email, please check your spam folder.
            </p>
          </div>
          <SignInButton mode="modal">
            <Button className="w-full">
              Sign In to Continue
            </Button>
          </SignInButton>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-muted/50">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
} 