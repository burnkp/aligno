export default {
  providers: [
    {
      domain: "clerk.alignometrix.com",
      applicationID: "convex",

      validateToken: async (token) => {
        console.log("Validating token with claims:", JSON.stringify(token, null, 2));
        
        if (!token || !token.sub || !token.email) {
          throw new Error("Invalid token: missing required claims");
        }

        // Create a standardized token with all required fields
        const standardizedToken = {
          ...token,
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
          tokenIdentifier: `https://clerk.alignometrix.com|${token.sub}`
        };

        console.log("Standardized token:", JSON.stringify(standardizedToken, null, 2));
        return standardizedToken;
      },

      // Role is now set in validateToken, this is just a backup
      roleFromToken: (token) => {
        return token.role || "user";
      },
    },
  ],
};