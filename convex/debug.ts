import { query } from "./_generated/server";
import logger from "./lib/logger";

/**
 * Debug endpoint to inspect JWT claims from Clerk
 * This endpoint should only be accessible in development
 */
export const inspectJWTClaims = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        logger.warn("inspectJWTClaims: No valid JWT found or user not authenticated");
        return {
          status: "error",
          message: "No valid JWT found or user not authenticated",
          claims: null
        };
      }

      // Extract all claims from the token
      const claims = {
        // Basic claims
        subject: identity.subject,
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email,
        
        // Role and permissions
        role: identity.role || "NO_ROLE_DEFINED",
        orgId: identity.orgId || "NO_ORG_ID_DEFINED",
        
        // Additional claims
        customClaims: identity.customClaims || {},
        
        // Auth metadata
        authType: identity.type,
        authProvider: identity.tokenIdentifier.split(":")[0],
        
        // Debug info
        rawToken: identity
      };

      logger.info("inspectJWTClaims: Successfully extracted claims", {
        subject: claims.subject,
        email: claims.email,
        role: claims.role,
        orgId: claims.orgId,
        authType: claims.authType
      });

      return {
        status: "success",
        message: "JWT claims extracted successfully",
        claims
      };
    } catch (error) {
      logger.error("inspectJWTClaims: Error extracting JWT claims", { error });
      return {
        status: "error",
        message: "Failed to extract JWT claims",
        error: error instanceof Error ? error.message : "Unknown error",
        claims: null
      };
    }
  },
}); 