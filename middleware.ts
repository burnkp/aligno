import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { SUPER_ADMINS } from "@/config/auth";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/get-started",
    "/get-started/confirmation",
    "/api/send-welcome-email",
    "/sign-in",
  ],
  afterAuth(auth, req) {
    // Handle authentication flow
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};