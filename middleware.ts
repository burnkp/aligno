import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import logger from "@/utils/logger";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/get-started",
    "/get-started/confirmation",
    "/sign-in",
    "/sign-up",
    "/privacy-policy",
    "/terms",
    "/api/clerk-webhooks"
  ],

  async afterAuth(auth, req) {
    const url = new URL(req.url);
    const path = url.pathname;

    try {
      // Log auth state
      logger.info("Middleware processing", {
        path,
        isAuthenticated: !!auth.userId,
        isPublicRoute: auth.isPublicRoute
      });

      // Handle unauthenticated access to protected routes
      if (!auth.userId && !auth.isPublicRoute) {
        logger.warn("Unauthenticated access attempt", { path });
        const signInUrl = new URL('/sign-in', req.url);
        // Preserve the original URL as a redirect parameter
        signInUrl.searchParams.set('redirect_url', url.pathname + url.search);
        return NextResponse.redirect(signInUrl);
      }

      // If authenticated, check super admin routes
      if (auth.userId && path.startsWith("/admin")) {
        const userEmail = auth.sessionClaims?.email as string;
        if (userEmail !== "kushtrim@promnestria.biz") {
          logger.warn("Unauthorized admin access attempt", {
            path,
            userEmail
          });
          return NextResponse.redirect(new URL('/', req.url));
        }
      }

      logger.info("Middleware check passed", {
        path,
        userId: auth.userId
      });

      return NextResponse.next();
    } catch (error) {
      logger.error("Middleware error", {
        error: error instanceof Error ? error.message : "Unknown error",
        path
      });
      return NextResponse.redirect(new URL('/error', req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!api/clerk-webhooks|_next/static|_next/image|favicon.ico).*)",
  ]
};