"use client";

import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";

export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md w-full space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <LoadingState className="h-12 w-12" text="Initializing authentication..." />
        </div>
      </Card>
    </div>
  );
}

export function AuthLoadingMinimal() {
  return (
    <div className="flex items-center justify-center p-4">
      <LoadingState className="h-4 w-4" text="Loading authentication..." />
    </div>
  );
} 