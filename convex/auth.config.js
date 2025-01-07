import { internal } from "./_generated/api";

export default {
  providers: [
    {
      domain: "clerk.alignometrix.com",
      applicationID: "convex",

      validateToken: async (token, ctx) => {
        // Log the incoming token using Convex's native logging
        await ctx.runMutation(internal.debug.log, {
          level: "debug",
          message: "Incoming token",
          data: token
        });
        
        if (!token || !token.sub || !token.email) {
          throw new Error("Invalid token: missing required claims");
        }

        // Create a standardized token with all required fields
        const standardizedToken = {
          // Map standard claims
          sub: token.sub,
          subject: token.sub,
          email: token.email,
          // Use the role from JWT claim, defaulting to "team_member"
          role: typeof token.role === 'string' ? token.role : "team_member",
          // For super admin, use 'system' as org_id, otherwise use the one from JWT
          orgId: token.role === "super_admin" ? "system" : token.org_id,
          // Add auth type
          type: "clerk",
          // Ensure token identifier is properly formatted
          tokenIdentifier: `https://clerk.alignometrix.com|${token.sub}`,
          // Store original token data in customClaims
          customClaims: token
        };

        // Log the standardized token
        await ctx.runMutation(internal.debug.log, {
          level: "debug",
          message: "Standardized token",
          data: standardizedToken
        });
        
        return standardizedToken;
      },

      // Role is now set in validateToken, this is just a backup
      roleFromToken: (token) => {
        return token.role || "team_member";
      },
    },
  ],
};