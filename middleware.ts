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
      const redirectUrl = url.searchParams.get("redirect_url");
      const email = url.searchParams.get("email");
      const orgName = url.searchParams.get("orgName");

      // Log authentication attempt
      logger.info("Authentication middleware processing", {
        path,
        isAuthenticated: !!auth.userId,
        isPublicRoute: auth.isPublicRoute,
        hasRedirect: !!redirectUrl,
        email,
        orgName
      });

      // Handle auth-callback route specifically
      if (path === '/auth-callback') {
        if (!auth.userId) {
          logger.warn("Unauthenticated access to auth-callback, redirecting to sign-in");
          const signInUrl = new URL('/sign-in', req.url);
          signInUrl.searchParams.set('redirect_url', '/auth-callback');
          if (email) signInUrl.searchParams.set('email', email);
          if (orgName) signInUrl.searchParams.set('orgName', orgName);
          return NextResponse.redirect(signInUrl);
        }
        // If authenticated, let the auth-callback page handle the flow
        logger.info("Authenticated user accessing auth-callback, proceeding");
        return NextResponse.next();
      }

      // Handle unauthenticated access to protected routes
      if (!auth.userId && !auth.isPublicRoute) {
        logger.warn("Unauthenticated access attempt to protected route", { path });
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', redirectUrl || path);
        if (email) signInUrl.searchParams.set('email', email);
        if (orgName) signInUrl.searchParams.set('orgName', orgName);
        return NextResponse.redirect(signInUrl);
      }

      // If authenticated, check role-based access
      if (auth.userId) {
        const userRole = auth.sessionClaims?.role as string || "team_member";
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
          return NextResponse.redirect(
            new URL(redirectUrl || '/auth-callback', req.url)
          );
        }

        // Handle organization verification
        const hasOrg = auth.sessionClaims?.org_id;
        if (!hasOrg && !path.startsWith('/auth/') && path !== '/auth-callback') {
          logger.warn("User without organization accessing protected route", {
            path,
            userId: auth.userId
          });
          return NextResponse.redirect(new URL('/auth-callback', req.url));
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
    // Match all paths except static files and api routes that don't need auth
    "/((?!.+\\.[\\w]+$|_next|api/send-welcome-email).*)",
    // Include specific API routes that need auth
    "/api/(.*)",
    // Explicitly include admin and debug routes
    "/debug/(.*)",
    "/email-debug/(.*)",
    "/admin/(.*)",
    // Include auth flow routes
    "/auth/(.*)"
  ]
};