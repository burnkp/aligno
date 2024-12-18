"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useEffect } from "react";
const logger = require("../../logger");

// Verify environment variables at initialization
const verifyEnvironmentVariables = () => {
  const missingVars = [];
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    missingVars.push("NEXT_PUBLIC_CONVEX_URL");
  }

  if (missingVars.length > 0) {
    const error = `Missing required environment variables: ${missingVars.join(", ")}`;
    logger.error(error);
    throw new Error(error);
  }
};

// Initialize Convex client
let convex: ConvexReactClient;
try {
  verifyEnvironmentVariables();
  convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
  logger.info("App-level Convex client initialized successfully");
} catch (error) {
  logger.error("Failed to initialize app-level Convex client:", error);
  throw error;
}

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    logger.info("Initializing app-level ConvexClientProvider");
    
    // Additional runtime checks
    try {
      verifyEnvironmentVariables();
      logger.info("App-level ConvexClientProvider environment variables verified");
    } catch (error) {
      logger.error("App-level ConvexClientProvider initialization failed:", error);
      throw error;
    }
  }, []);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}