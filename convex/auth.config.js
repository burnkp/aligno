import { v } from "convex/values";

export default {
  providers: [
    {
      domain: "clerk.alignometrix.com",
      applicationID: "convex",

      validateToken: async (token) => {
        // Log the incoming token
        console.log("[AUTH_DEBUG] Incoming token:", JSON.stringify(token, null, 2));
        
        if (!token || !token.sub || !token.email) {
          throw new Error("Invalid token: missing required claims");
        }

        // Create a standardized token with all required fields
        const standardizedToken = {
          // Map standard claims
          sub: token.sub,
          subject: token.sub,
          email: token.email,
          // Use the role from JWT claim
          role: token.role || "user",
          // For super admin, use 'system' as org_id, otherwise use the one from JWT
          orgId: token.role === "super_admin" ? "system" : (token.org_id || null),
          // Add auth type
          type: "clerk",
          // Ensure token identifier is properly formatted
          tokenIdentifier: `https://clerk.alignometrix.com|${token.sub}`,
          // Store original token data in customClaims
          customClaims: {
            emailVerified: token.emailVerified,
            familyName: token.familyName,
            givenName: token.givenName,
            issuer: token.issuer,
            name: token.name,
            phoneNumberVerified: token.phoneNumberVerified,
            pictureUrl: token.pictureUrl,
            updatedAt: token.updatedAt
          }
        };

        // Log the standardized token
        console.log("[AUTH_DEBUG] Standardized token:", JSON.stringify(standardizedToken, null, 2));
        
        return standardizedToken;
      },

      // Role is now set in validateToken, this is just a backup
      roleFromToken: (token) => {
        return token.role || "user";
      },
    },
  ],
};