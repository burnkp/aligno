import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { SUPER_ADMINS } from "@/config/auth";

export default authMiddleware({
  debug: true,
  publicRoutes: [
    "/",
    "/get-started",
    "/sign-in",
    "/sign-up"
  ],
  async afterAuth(auth, req) {
    console.log("⭐️ Middleware executing for:", req.url);

    const url = new URL(req.url);
    console.log("🔍 Route check:", {
      path: url.pathname,
    });

    // If the user is not authenticated, allow them to access public routes
    if (!auth.userId) {
      const isPublicRoute = ["/", "/get-started", "/sign-in", "/sign-up"].includes(url.pathname);
      if (isPublicRoute) {
        console.log("✅ Allowing public route access");
        return NextResponse.next();
      }
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

      // Handle super admin redirection after sign-in
      if (primaryEmail && SUPER_ADMINS.includes(primaryEmail) && url.pathname === "/dashboard") {
        console.log("🔄 Redirecting super admin to admin dashboard");
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
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