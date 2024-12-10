import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { SUPER_ADMINS } from "@/config/auth";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/sign-in*", "/sign-up*"];

// Define auth routes that are part of the authentication flow
const authRoutes = ["/auth-callback"];

export default authMiddleware({
  debug: true,
  async afterAuth(auth, req) {
    console.log("⭐️ Middleware executing for:", req.url);

    // Check if the route is public, auth-related, or requires authentication
    const url = new URL(req.url);
    const isPublicRoute = publicRoutes.some(pattern => {
      if (pattern.endsWith("*")) {
        return url.pathname.startsWith(pattern.slice(0, -1));
      }
      return url.pathname === pattern;
    });
    const isAuthRoute = authRoutes.includes(url.pathname);
    const isAuthCallback = url.pathname === "/auth-callback";

    console.log("🔍 Route check:", {
      path: url.pathname,
      isPublicRoute,
      isAuthRoute,
      isAuthCallback,
    });

    // Allow access to public routes
    if (isPublicRoute) {
      console.log("✅ Allowing public route access");
      return NextResponse.next();
    }

    // Allow access to auth callback route
    if (isAuthCallback) {
      console.log("✅ Allowing auth route access");
      return NextResponse.next();
    }

    // If the user is not authenticated, redirect to sign-in
    if (!auth.userId) {
      console.log("🚫 User not authenticated, redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // For protected routes, verify user and check permissions
    try {
      // Fetch the complete user data from Clerk
      const user = await clerkClient.users.getUser(auth.userId);
      
      if (!user) {
        console.log("❌ User not found");
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Get primary email
      const primaryEmail = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      )?.emailAddress?.toLowerCase();

      console.log("📧 User email:", primaryEmail);

      // Check if user is trying to access admin routes
      if (url.pathname.startsWith("/admin")) {
        // Verify if user is a super admin
        if (!primaryEmail || !SUPER_ADMINS.includes(primaryEmail)) {
          console.log("🚫 User not authorized for admin access");
          return NextResponse.redirect(new URL("/", req.url));
        }
        console.log("✅ Super admin access granted");
      }

      return NextResponse.next();
    } catch (error) {
      console.log("🔥 Middleware error:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};