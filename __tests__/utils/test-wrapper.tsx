import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React, { ReactNode } from 'react';
import { vi } from 'vitest';

// Mock Convex client
const mockConvex = {
  _store: new Map(),
  mutation: vi.fn(),
  query: vi.fn(),
  action: vi.fn(),
};

export const TestWrapper = ({ children }: { children: ReactNode }) => {
  return React.createElement(
    ClerkProvider,
    {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test',
    },
    React.createElement(
      ConvexProviderWithClerk,
      {
        client: mockConvex as any,
      },
      children
    )
  );
}; 