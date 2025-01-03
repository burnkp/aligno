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

      // Log the raw identity for debugging
      logger.debug("Raw identity:", JSON.stringify(identity, null, 2));

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
        authType: identity.type || "unknown",
        authProvider: "clerk",
        
        // Raw token data
        rawToken: {
          ...(identity.customClaims as Record<string, unknown>),
          // Add back the standardized fields for completeness
          email: identity.email,
          role: identity.role,
          org_id: identity.orgId,
          subject: identity.subject,
          tokenIdentifier: identity.tokenIdentifier?.split("|")[0] + "|***"
        }
      };

      logger.info("JWT claims extracted:", {
        subject: claims.subject,
        email: claims.email,
        role: claims.role,
        orgId: claims.orgId,
        authType: claims.authType,
        authProvider: claims.authProvider
      });

      return {
        status: "success",
        message: "JWT claims extracted successfully",
        claims
      };
    } catch (error) {
      logger.error("Error extracting JWT claims:", { 
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : undefined
      });

      return {
        status: "error",
        message: error instanceof Error 
          ? `Failed to extract JWT claims: ${error.message}`
          : "Failed to extract JWT claims: Unknown error",
        claims: null
      };
    }
  },
}); 