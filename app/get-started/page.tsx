"use client";

import { useState } from "react";
import { OrganizationSetupWizard } from "@/components/admin/organization-setup-wizard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GetStartedPage() {
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(true);

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Get Started with Aligno</h1>
          <p className="text-muted-foreground text-center max-w-2xl mb-8">
            Let's set up your organization and get you started with Aligno. Follow
            our simple setup process to configure your workspace.
          </p>

          <Button
            size="lg"
            onClick={() => setIsSetupWizardOpen(true)}
            className="min-w-[200px]"
          >
            Start Setup
          </Button>
        </div>
      </div>

      <OrganizationSetupWizard
        isOpen={isSetupWizardOpen}
        onClose={() => setIsSetupWizardOpen(false)}
      />
    </div>
  );
} 