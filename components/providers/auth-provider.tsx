"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import logger from "@/utils/logger";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    logger.info("Initializing AuthProvider");
    validateEnvironmentVariables();
  }, []);

  const validateEnvironmentVariables = () => {
    // Only check for the public environment variables on the client side
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      const error = "Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable";
      logger.error(error);
      throw new Error(error);
    }

    logger.info("AuthProvider: Environment variables validated successfully");
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        variables: { colorPrimary: "#624CF5" },
        elements: {
          footer: { display: "none" },
          rootBox: {
            "@keyframes fade-in": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
            animation: "fade-in 0.5s ease-out",
          },
        },
      }}
      isSatellite={false}
      navigate={(to) => {
        window.location.href = to;
      }}
    >
      {children}
    </ClerkProvider>
  );
};