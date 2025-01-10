"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { AuthLoading } from "@/components/providers/auth-loading";
import { Suspense } from "react";
import { AuthErrorBoundary } from "@/components/providers/auth-error-boundary";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <AuthErrorBoundary>
          <AuthProvider>
            <Suspense fallback={<AuthLoading />}>
              {children}
            </Suspense>
          </AuthProvider>
        </AuthErrorBoundary>
      </ConvexClientProvider>
    </ClerkProvider>
  );
} 