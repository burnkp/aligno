"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConvexProviderWithClerk
      client={convex}
      useAuth={useAuth}
      loadingFallback={<div style={{ opacity: 0 }}>{children}</div>}
    >
      {children}
    </ConvexProviderWithClerk>
  );
}; 