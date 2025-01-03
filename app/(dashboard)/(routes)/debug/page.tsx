"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JWTInspector from "@/components/debug/jwt-inspector";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingState } from "@/components/ui/loading-state";

export default function DebugPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?redirect_url=/debug");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <LoadingState fullScreen />;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <JWTInspector />
        </CardContent>
      </Card>
    </div>
  );
} 