import { vi } from 'vitest';

// Mock Convex client
export const mockConvex = {
  _store: new Map(),
  mutation: vi.fn(),
  query: vi.fn(),
  action: vi.fn(),
};

// Mock Auth
export const mockAuth = () => ({
  isAuthenticated: true,
  isLoading: false,
  userId: 'test-user-id',
}); 