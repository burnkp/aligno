import { render, screen, waitFor } from '@testing-library/react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import { useQuery } from 'convex/react';
import { vi } from 'vitest';
import LandingPage from '@/app/page';
import { TestWrapper } from '../utils/test-wrapper';

// Mock Clerk hooks
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
  useUser: vi.fn(),
}));

// Mock Convex hooks
vi.mock('convex/react', () => ({
  useConvexAuth: vi.fn(),
  useQuery: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Landing Page Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  test('shows correct CTA for non-authenticated users', async () => {
    // Mock non-authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      userId: null,
    });
    
    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    (useUser as jest.Mock).mockReturnValue({
      user: null,
    });

    render(<TestWrapper><LandingPage /></TestWrapper>);

    // Verify non-authenticated UI elements
    expect(screen.getByText('Start Your Free Trial')).toBeInTheDocument();
    expect(screen.getByText('Watch Demo')).toBeInTheDocument();
  });

  test('shows dashboard button for authenticated users', async () => {
    // Mock authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      userId: 'test-user-id',
    });
    
    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    (useUser as jest.Mock).mockReturnValue({
      user: {
        primaryEmailAddress: {
          emailAddress: 'test@example.com',
        },
      },
    });

    // Mock user data from Convex
    (useQuery as jest.Mock).mockReturnValue({
      role: 'team_member',
      organizationId: 'test-org',
    });

    render(<TestWrapper><LandingPage /></TestWrapper>);

    // Verify authenticated UI elements
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });

  test('redirects super admin to admin dashboard', async () => {
    // Mock super admin state
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      userId: 'super-admin-id',
    });
    
    (useUser as jest.Mock).mockReturnValue({
      user: {
        primaryEmailAddress: {
          emailAddress: 'kushtrim@promnestria.biz',
        },
      },
    });

    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<TestWrapper><LandingPage /></TestWrapper>);

    // Verify super admin redirection
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  test('redirects org admin to organization dashboard', async () => {
    // Mock org admin state
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      userId: 'org-admin-id',
    });

    (useUser as jest.Mock).mockReturnValue({
      user: {
        primaryEmailAddress: {
          emailAddress: 'admin@example.com',
        },
      },
    });

    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    // Mock user data from Convex
    (useQuery as jest.Mock).mockReturnValue({
      role: 'org_admin',
      organizationId: 'test-org-id',
    });

    render(<TestWrapper><LandingPage /></TestWrapper>);

    // Verify org admin redirection
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/organizations/test-org-id');
    });
  });

  test('handles authentication errors gracefully', async () => {
    // Mock authentication error state
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
      userId: 'error-user-id',
    });

    (useUser as jest.Mock).mockReturnValue({
      user: {
        primaryEmailAddress: {
          emailAddress: 'error@example.com',
        },
      },
    });

    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    // Mock Convex query error
    (useQuery as jest.Mock).mockImplementation(() => {
      throw new Error('Authentication failed');
    });

    render(<TestWrapper><LandingPage /></TestWrapper>);

    // Verify error handling UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try again')).toBeInTheDocument();
  });
}); 