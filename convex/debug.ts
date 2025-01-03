import { query } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Debug endpoint to inspect JWT claims from Clerk
 * This endpoint is restricted to super_admin users only
 */
export const inspectJWTClaims = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      
      if (!identity) {
        console.warn("[DEBUG] No valid JWT found or user not authenticated");
        return {
          status: "error",
          message: "No valid JWT found or user not authenticated",
          claims: null
        };
      }

      // Check if user is super_admin
      if (identity.role !== "super_admin") {
        console.warn("[DEBUG] Unauthorized access attempt:", identity.email);
        return {
          status: "error",
          message: "Unauthorized: This endpoint is restricted to super administrators only",
          claims: null
        };
      }

      // Log the complete identity object
      console.log("[DEBUG] Complete identity object:", JSON.stringify(identity, null, 2));

      // Extract all claims from the token
      const claims = {
        // Basic claims
        subject: identity.subject,
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email,
        
        // Role and permissions
        role: identity.role || "NO_ROLE_DEFINED",
        orgId: identity.role === "super_admin" ? "system" : (identity.orgId || "NO_ORG_ID_DEFINED"),
        
        // Additional claims
        customClaims: identity.customClaims || {},
        
        // Auth metadata
        authType: identity.type || "clerk",
        authProvider: "clerk",
        
        // Raw token data (sanitized for security)
        rawToken: {
          email: identity.email,
          role: identity.role,
          subject: identity.subject,
          tokenIdentifier: identity.tokenIdentifier?.split("|")[0] + "|***",
          ...(identity.customClaims as Record<string, unknown> || {})
        }
      };

      // Log the final claims object
      console.log("[DEBUG] Final claims object:", JSON.stringify(claims, null, 2));

      return {
        status: "success",
        message: "JWT claims extracted successfully",
        claims
      };
    } catch (error) {
      console.error("[DEBUG] Error extracting JWT claims:", JSON.stringify({ 
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : undefined
      }, null, 2));

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

// Internal logging function
export const log = internalMutation({
  args: {
    level: v.union(v.literal("debug"), v.literal("info"), v.literal("warn"), v.literal("error")),
    message: v.string(),
    data: v.any()
  },
  handler: async (ctx, { level, message, data }) => {
    console.log(`[DEBUG:${level.toUpperCase()}] ${message}:`, JSON.stringify(data, null, 2));
  }
}); 