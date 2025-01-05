"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to your error reporting service
    console.error("[AUTH_ERROR]", {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return <AuthErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface AuthErrorFallbackProps {
  error: Error | null;
}

function AuthErrorFallback({ error }: AuthErrorFallbackProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("[AUTH_ERROR] Failed to sign out:", error);
      // Force reload as a fallback
      window.location.href = "/sign-in";
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
      <p className="text-gray-600 mb-4">
        We encountered an issue with your authentication session. This could be due to:
      </p>
      <ul className="list-disc pl-5 mb-4 text-gray-600">
        <li>An expired session</li>
        <li>Invalid authentication token</li>
        <li>Network connectivity issues</li>
      </ul>
      <p className="text-sm text-gray-500 mb-6">
        Error details: {error?.message || "Unknown authentication error"}
      </p>
      <div className="space-x-4">
        <Button onClick={handleRetry} variant="outline">
          Retry
        </Button>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>
    </Card>
  );
} 