"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
const logger = require("../../logger");

// Verify environment variables at initialization
const verifyEnvironmentVariables = () => {
  const requiredVars = [
    'NEXT_PUBLIC_CONVEX_URL',
    'CONVEX_DEPLOYMENT'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    const error = `Missing required Convex environment variables: ${missingVars.join(", ")}`;
    logger.error(error);
    throw new Error(error);
  }

  logger.info("ConvexClientProvider: All required environment variables verified");
  logger.info("ConvexClientProvider: Using Convex deployment:", process.env.CONVEX_DEPLOYMENT);
  logger.info("ConvexClientProvider: Convex URL configured as:", process.env.NEXT_PUBLIC_CONVEX_URL);
};

// Initialize Convex client
let convex: ConvexReactClient;
try {
  verifyEnvironmentVariables();
  convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
  logger.info("ConvexClientProvider: Convex client initialized successfully");
} catch (error) {
  logger.error("ConvexClientProvider: Failed to initialize Convex client:", error);
  throw error;
}

export function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    logger.info("ConvexClientProvider: Component mounted");
    
    // Additional runtime checks
    try {
      verifyEnvironmentVariables();
      logger.info("ConvexClientProvider: Runtime environment verification successful");
    } catch (error) {
      logger.error("ConvexClientProvider: Runtime verification failed:", error);
      throw error;
    }
  }, []);

  return (
    <ConvexProviderWithClerk
      client={convex}
      useAuth={useAuth}
    >
      {children}
    </ConvexProviderWithClerk>
  );
} 