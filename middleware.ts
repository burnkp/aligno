import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Explicitly set runtime to nodejs
export const runtime = "nodejs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/get-started",
    "/get-started/confirmation",
    "/api/send-welcome-email",
    "/sign-in",
    "/sign-up",
    "/privacy-policy",
    "/terms"
  ],
  afterAuth(auth, req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const redirectUrl = url.searchParams.get("redirect_url");
    const email = url.searchParams.get("email");
    const orgName = url.searchParams.get("orgName");

    // If user is not authenticated and trying to access a protected route
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', redirectUrl || path);
      if (email) signInUrl.searchParams.set('email', email);
      if (orgName) signInUrl.searchParams.set('orgName', orgName);
      return NextResponse.redirect(signInUrl);
    }

    // If user is authenticated and has redirect_url with email/orgName
    if (auth.userId && redirectUrl === '/auth/setup' && email && orgName) {
      const setupUrl = new URL('/auth/setup', req.url);
      setupUrl.searchParams.set('email', email);
      setupUrl.searchParams.set('orgName', decodeURIComponent(orgName));
      return NextResponse.redirect(setupUrl);
    }

    // If user is authenticated and on sign-in page
    if (auth.userId && path === '/sign-in') {
      // If there's a redirect URL, use it
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, req.url));
      }
      // Otherwise, go to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }
});

// Update matcher configuration to be more specific
export const config = {
  matcher: [
    // Match all paths except static files and api routes that don't need auth
    "/((?!.+\\.[\\w]+$|_next|api/send-welcome-email).*)",
    // Include specific API routes that need auth
    "/api/(.*)"],
};