import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import logger from "./lib/logger";

export const getUser = query({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("userId", args.userId))
      .first();
    return user;
  },
});

export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const { clerkId, email, name } = args;

    try {
      // Find existing user by email
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
        .first();

      if (existingUser) {
        // Update existing user with Clerk ID
        if (existingUser.userId === "pending") {
          await ctx.db.patch(existingUser._id, {
            userId: clerkId,
            name,
            updatedAt: new Date().toISOString()
          });

          logger.info("Updated pending user with Clerk ID", {
            userId: clerkId,
            email,
            organizationId: existingUser.organizationId
          });
        }
        return existingUser._id;
      }

      // If no existing user, create a new one (this shouldn't happen often)
      logger.warn("Creating new user from Clerk webhook - unexpected flow", {
        clerkId,
        email
      });

      const userId = await ctx.db.insert("users", {
        userId: clerkId,
        email: email.toLowerCase(),
        name,
        role: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return userId;
    } catch (error) {
      logger.error("Error syncing user from Clerk", {
        error: error instanceof Error ? error.message : "Unknown error",
        clerkId,
        email
      });
      throw error;
    }
  },
});

export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  async handler(ctx, args) {
    const { clerkId } = args;

    try {
      // Find user by Clerk ID
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("userId", clerkId))
        .first();

      if (!user) {
        logger.warn("User not found for deletion", { clerkId });
        return;
      }

      // Delete the user
      await ctx.db.delete(user._id);

      logger.info("User deleted", {
        userId: clerkId,
        email: user.email,
        organizationId: user.organizationId
      });
    } catch (error) {
      logger.error("Error deleting user", {
        error: error instanceof Error ? error.message : "Unknown error",
        clerkId
      });
      throw error;
    }
  },
}); 