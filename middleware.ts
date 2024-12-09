import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SUPER_ADMIN_EMAIL = "kushtrim@promnestria.biz";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/", "/get-started"],
  
  async afterAuth(auth, req) {
    const { userId, user } = auth;
    const isPublicRoute = req.url.includes("/get-started") || req.url === "/";

    // Allow public routes without authentication
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Redirect to sign in if not authenticated
    if (!userId || !user) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    try {
      // Special handling for super admin email
      const primaryEmail = user.emailAddresses[0]?.emailAddress;
      if (primaryEmail === SUPER_ADMIN_EMAIL) {
        // If accessing admin routes, allow access
        if (req.url.includes("/admin")) {
          return NextResponse.next();
        }
        // If accessing other routes, redirect to admin dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      // For non-super admin users, get user data
      const userData = await convex.query(api.users.getUser, { userId });

      // If user exists, handle routing based on role
      if (userData) {
        // Prevent access to admin routes for non-super admins
        if (req.url.includes("/admin")) {
          return NextResponse.redirect(new URL("/", req.url));
        }

        // Handle sign-in/sign-up redirects
        if (req.url.includes("/sign-in") || req.url.includes("/sign-up")) {
          switch (userData.role) {
            case "org_admin":
              return NextResponse.redirect(new URL(`/organizations/${userData.organizationId}`, req.url));
            case "team_leader":
            case "team_member":
              return NextResponse.redirect(new URL("/teams", req.url));
            default:
              return NextResponse.redirect(new URL("/", req.url));
          }
        }
      }
    } catch (error) {
      console.error("Error in middleware:", error);
      // On error, allow the request to continue to handle error states in the UI
      return NextResponse.next();
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};