import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { AuthLoading } from "@/components/providers/auth-loading";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { AuthErrorBoundary } from "@/components/providers/auth-error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aligno",
  description: "Performance Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights />
        <Analytics />
        <ClerkProvider>
          <AuthErrorBoundary>
            <AuthProvider>
              <Suspense fallback={<AuthLoading />}>
                <ConvexClientProvider>
                  {children}
                </ConvexClientProvider>
              </Suspense>
            </AuthProvider>
          </AuthErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}