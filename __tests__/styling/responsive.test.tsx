import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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

// Mock window resize
const resizeWindow = (width: number, height: number) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
};

describe('Landing Page Responsive Design', () => {
  beforeEach(() => {
    // Reset window size and mocks
    resizeWindow(1920, 1080);
    vi.clearAllMocks();

    // Mock non-authenticated state for consistent testing
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      userId: null,
    });
    
    (useUser as jest.Mock).mockReturnValue({
      user: null,
    });

    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });
  });

  test('renders correctly on desktop', () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    // Check desktop-specific classes
    expect(container.querySelector('.md\\:grid-cols-3')).toBeInTheDocument();
    expect(container.querySelector('.hidden.md\\:block')).toBeInTheDocument();
  });

  test('adapts to tablet size', async () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    // Simulate tablet width
    act(() => {
      resizeWindow(768, 1024);
    });
    
    // Check tablet-specific classes
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    expect(container.querySelector('.md\\:hidden')).toBeInTheDocument();
  });

  test('adapts to mobile size', async () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    // Simulate mobile width
    act(() => {
      resizeWindow(375, 667);
    });
    
    // Check mobile-specific classes
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    expect(container.querySelector('.block.md\\:hidden')).toBeInTheDocument();
  });
});

describe('Landing Page Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock non-authenticated state for consistent testing
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
      userId: null,
    });
    
    (useUser as jest.Mock).mockReturnValue({
      user: null,
    });

    (useConvexAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });
  });

  test('applies fade-up animation to hero section', () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    const heroSection = container.querySelector('[data-testid="hero-section"]');
    expect(heroSection).toHaveClass('animate-fade-up');
  });

  test('applies staggered animations to feature cards', () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    const featureCards = container.querySelectorAll('[data-testid="feature-card"]');
    featureCards.forEach((card, index) => {
      expect(card).toHaveStyle(`animation-delay: ${index * 0.1}s`);
    });
  });

  test('applies hover animations to pricing cards', async () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    const pricingCard = container.querySelector('[data-testid="pricing-card"]');
    
    // Simulate hover
    act(() => {
      pricingCard?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
    
    expect(pricingCard).toHaveClass('hover:shadow-lg');
    expect(pricingCard).toHaveClass('hover:border-purple-200');
  });

  test('applies transition to navbar on scroll', async () => {
    const { container } = render(<TestWrapper><LandingPage /></TestWrapper>);
    
    const navbar = container.querySelector('[data-testid="navbar"]');
    
    // Simulate scroll
    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });
    
    expect(navbar).toHaveClass('bg-white/80');
    expect(navbar).toHaveClass('backdrop-blur-sm');
  });
}); 