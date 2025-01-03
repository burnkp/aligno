import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { AuthLoading } from "@/components/providers/auth-loading";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <AuthProvider>
          <Suspense fallback={<LoadingState fullScreen />}>
            <AuthLoading>
              <ConvexClientProvider>
                {children}
              </ConvexClientProvider>
            </AuthLoading>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}