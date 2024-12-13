"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orgName = searchParams.get("orgName");
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen bg-muted/50 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="text-3xl font-bold">Organization Created Successfully!</h1>
          <p className="text-muted-foreground max-w-lg">
            Thank you for choosing Aligno! Your organization {orgName && `"${orgName}"`} has been created and is pending activation.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h2 className="font-semibold">Next Steps:</h2>
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 mt-0.5 text-blue-500" />
            <div>
              <p className="text-sm">
                We've sent a confirmation email to <span className="font-medium">{email}</span> with instructions to access your account.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Please check your inbox and follow the link to set up your password and complete the authentication process.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
} 