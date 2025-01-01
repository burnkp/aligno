import { query } from "../_generated/server";

export default query(async (ctx) => {
  try {
    // Extract the user identity from the context
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return {
        error: "No valid JWT found or the user is not authenticated.",
      };
    }

    // Decode and log the JWT claims
    const claims = {
      userId: identity.subject,
      email: identity.email,
      role: identity.role || "No role defined",
      metadata: identity.customClaims || {},
    };

    return {
      success: true,
      claims,
    };
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return {
      success: false,
      error: "Failed to decode JWT. Check server logs for details.",
    };
  }
});