"use client";

import { ReactNode, useEffect, useCallback, useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import logger from "@/utils/logger";
import { useRouter } from "next/navigation";
import { AuthLoadingMinimal } from "./auth-loading";

interface ConvexClientProviderProps {
  children: ReactNode;
}

interface ConvexClientState {
  isInitialized: boolean;
  error: Error | null;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Initialize Convex client with error handling and retry logic
const initializeConvexClient = (
  retryCount: number = 0
): Promise<ConvexReactClient> => {
  return new Promise((resolve, reject) => {
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      const error = "Missing NEXT_PUBLIC_CONVEX_URL environment variable";
      logger.error(error);
      reject(new Error(error));
      return;
    }

    try {
      const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
      
      logger.info("ConvexClientProvider: Client initialized successfully", {
        retryCount,
        url: process.env.NEXT_PUBLIC_CONVEX_URL
      });
      
      resolve(client);
    } catch (error) {
      logger.error("ConvexClientProvider: Failed to initialize client:", {
        error,
        retryCount,
        maxRetries: MAX_RETRIES
      });

      if (retryCount < MAX_RETRIES) {
        logger.info(`Retrying client initialization (${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => {
          initializeConvexClient(retryCount + 1)
            .then(resolve)
            .catch(reject);
        }, RETRY_DELAY);
        return;
      }

      reject(error);
    }
  });
};

// Initialize the client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? "");

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<ConvexClientState>({
    isInitialized: false,
    error: null,
    retryCount: 0
  });

  const handleError = useCallback((error: Error) => {
    logger.error("ConvexClientProvider: Error occurred:", error);
    setState(prev => ({
      ...prev,
      error,
      retryCount: prev.retryCount + 1
    }));

    // Handle specific error types
    if (error.message.includes("authentication")) {
      logger.warn("Authentication error detected, redirecting to sign-in");
      router.push("/sign-in");
    }
  }, [router]);

  const initializeProvider = useCallback(async () => {
    try {
      // Validate environment variables
      if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
        throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
      }

      setState(prev => ({ ...prev, isInitialized: true, error: null }));
      logger.info("ConvexClientProvider: Provider initialized successfully");
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  // Initialize on mount
  useEffect(() => {
    if (isAuthLoaded) {
      initializeProvider();
    }

    return () => {
      logger.info("ConvexClientProvider: Component unmounting");
    };
  }, [isAuthLoaded, initializeProvider]);

  // Handle auth state changes
  useEffect(() => {
    if (isAuthLoaded) {
      logger.info("Auth state changed:", { isSignedIn });
    }
  }, [isAuthLoaded, isSignedIn]);

  // Show loading state while initializing
  if (!state.isInitialized || !isAuthLoaded) {
    return <AuthLoadingMinimal />;
  }

  // Show error state if initialization failed
  if (state.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-700 font-semibold">Connection Error</h3>
        <p className="text-red-600 text-sm mt-1">{state.error.message}</p>
        {state.retryCount < MAX_RETRIES && (
          <button
            onClick={() => initializeProvider()}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Retry Connection
          </button>
        )}
      </div>
    );
  }

  return (
    <ConvexProviderWithClerk
      client={convex}
      useAuth={useAuth}
    >
      {children}
    </ConvexProviderWithClerk>
  );
} 