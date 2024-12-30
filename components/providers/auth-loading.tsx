"use client";

import { useAuth } from "@clerk/nextjs";
import { LoadingState } from "@/components/ui/loading-state";
import { useEffect, useState } from "react";

interface AuthLoadingProps {
  children: React.ReactNode;
}

export function AuthLoading({ children }: AuthLoadingProps) {
  const { isLoaded } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // After first load, set initialLoad to false
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 300); // Small delay to prevent flash
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!isLoaded || isInitialLoad) {
    return <LoadingState fullScreen text="Loading..." />;
  }

  return <>{children}</>;
} 