"use client";

import { ReactNode, useEffect, useCallback } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import logger from "@/utils/logger";

interface ConvexClientProviderProps {
  children: ReactNode;
}

// Initialize Convex client with error handling
const initializeConvexClient = (): ConvexReactClient => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    const error = "Missing NEXT_PUBLIC_CONVEX_URL environment variable";
    logger.error(error);
    throw new Error(error);
  }

  try {
    const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    logger.info("ConvexClientProvider: Client initialized successfully");
    return client;
  } catch (error) {
    logger.error("ConvexClientProvider: Failed to initialize client:", error);
    throw error;
  }
};

// Initialize the client
const convex = initializeConvexClient();

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  const validateEnvironmentVariables = useCallback(() => {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      const error = "Missing NEXT_PUBLIC_CONVEX_URL environment variable";
      logger.error(error);
      throw new Error(error);
    }
    logger.info("ConvexClientProvider: Environment variables validated successfully");
  }, []);

  const verifyRuntime = useCallback(() => {
    try {
      validateEnvironmentVariables();
      logger.info("ConvexClientProvider: Runtime verification successful");
    } catch (error) {
      logger.error("ConvexClientProvider: Runtime verification failed:", error);
      throw error;
    }
  }, [validateEnvironmentVariables]);

  useEffect(() => {
    logger.info("ConvexClientProvider: Component mounted");
    verifyRuntime();

    return () => {
      logger.info("ConvexClientProvider: Component unmounting");
    };
  }, [verifyRuntime]);

  return (
    <ConvexProviderWithClerk
      client={convex}
      useAuth={useAuth}
    >
      {children}
    </ConvexProviderWithClerk>
  );
} 