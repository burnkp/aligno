import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import logger from "@/utils/logger";

// Explicitly set runtime to nodejs
export const runtime = "nodejs";

// Define protected route patterns that require specific roles
const ROLE_PROTECTED_ROUTES = {
  SUPER_ADMIN: ["/debug", "/email-debug", "/admin"],
  ADMIN: ["/settings", "/organization"],
  USER: ["/dashboard", "/teams", "/analytics"]
};

// Define routes that should redirect to specific paths based on conditions
const CONDITIONAL_REDIRECTS = {
  ONBOARDING: ["/auth/setup", "/auth/organization"],
  VERIFICATION: ["/auth/verify", "/auth/confirm"]
};

export default authMiddleware({
  publicRoutes: [
    "/",
    "/get-started",
    "/get-started/confirmation",
    "/auth-callback",
    "/api/send-welcome-email",
    "/sign-in",
    "/sign-up",
    "/privacy-policy",
    "/terms"
  ],
  async afterAuth(auth, req) {
    try {
      const url = new URL(req.url);
      const path = url.pathname;
      const email = url.searchParams.get("email");
      const orgName = url.searchParams.get("orgName");
      const redirectUrl = url.searchParams.get("redirect_url");

      // Helper function to preserve URL parameters
      const preserveParams = (targetUrl: URL) => {
        url.searchParams.forEach((value, key) => {
          targetUrl.searchParams.set(key, value);
        });
        return targetUrl;
      };

      // Log authentication attempt
      logger.info("Authentication middleware processing", {
        path,
        isAuthenticated: !!auth.userId,
        isPublicRoute: auth.isPublicRoute,
        hasRedirect: !!redirectUrl,
        email,
        orgName,
        allParams: Object.fromEntries(url.searchParams.entries())
      });

      // Special handling for auth-callback
      if (path === '/auth-callback') {
        // Always require authentication for auth-callback
        if (!auth.userId) {
          logger.info("Auth-callback: Redirecting to sign-in", {
            email,
            orgName
          });
          const signInUrl = preserveParams(new URL('/sign-in', req.url));
          return NextResponse.redirect(signInUrl);
        }

        // If authenticated but no context, redirect to dashboard
        if (!email && !orgName) {
          logger.info("Auth-callback: No context, redirecting to dashboard");
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        // Proceed with callback if we have both auth and context
        logger.info("Auth-callback: Proceeding with full context", {
          userId: auth.userId,
          email,
          orgName
        });
        return NextResponse.next();
      }

      // Handle unauthenticated access to protected routes
      if (!auth.userId && !auth.isPublicRoute) {
        logger.warn("Unauthenticated access attempt to protected route", { path });
        const signInUrl = preserveParams(new URL('/sign-in', req.url));
        return NextResponse.redirect(signInUrl);
      }

      // If authenticated, check role-based access
      if (auth.userId) {
        const userEmail = auth.sessionClaims?.email as string;
        
        // Check super admin routes
        if (path.startsWith("/admin")) {
          if (userEmail !== "kushtrim@promnestria.biz") {
            logger.warn("Unauthorized access attempt to admin route", {
              path,
              userEmail
            });
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }

        // Handle authenticated users on auth pages
        if (path === '/sign-in' || path === '/sign-up') {
          logger.info("Redirecting authenticated user from auth page", {
            path,
            redirectUrl
          });
          // If we have org context, go to auth-callback, otherwise dashboard
          const targetUrl = email || orgName
            ? preserveParams(new URL('/auth-callback', req.url))
            : new URL('/dashboard', req.url);
          return NextResponse.redirect(targetUrl);
        }

        // Handle organization verification
        const hasOrg = auth.sessionClaims?.org_id;
        if (!hasOrg && !path.startsWith('/auth/') && path !== '/auth-callback') {
          logger.warn("User without organization accessing protected route", {
            path,
            userId: auth.userId
          });
          const callbackUrl = preserveParams(new URL('/auth-callback', req.url));
          return NextResponse.redirect(callbackUrl);
        }
      }

      logger.info("Middleware processing completed", {
        path,
        status: "success"
      });

      return NextResponse.next();
    } catch (error) {
      logger.error("Middleware error", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: new URL(req.url).pathname
      });
      return NextResponse.redirect(new URL('/error', req.url));
    }
  }
});

// Update matcher configuration to be more specific and include all protected paths
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|api/send-welcome-email).*)",
    "/api/(.*)",
    "/debug/(.*)",
    "/email-debug/(.*)",
    "/admin/(.*)",
    "/auth/(.*)"
  ]
};