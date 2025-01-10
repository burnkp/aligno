"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import logger from "@/utils/logger";

// Initialize Convex client outside of component to avoid re-initialization
const initializeConvexClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
  }
  return new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};

// Initialize the client once
const convex = initializeConvexClient();

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    logger.info("ConvexClientProvider mounted");
    return () => {
      logger.info("ConvexClientProvider unmounted");
    };
  }, []);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
} 