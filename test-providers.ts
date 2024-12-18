import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
const logger = require("./logger");

export async function testProviderConfiguration() {
  logger.info("Starting provider configuration test");

  // Test Clerk configuration
  try {
    logger.info("Testing Clerk configuration...");
    const requiredClerkVars = [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'
    ];

    requiredClerkVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing Clerk environment variable: ${varName}`);
      }
      logger.info(`✓ ${varName} is configured`);
    });

    logger.info("✓ Clerk configuration verified");
  } catch (error) {
    logger.error("❌ Clerk configuration test failed:", error);
    throw error;
  }

  // Test Convex configuration
  try {
    logger.info("Testing Convex configuration...");
    const requiredConvexVars = [
      'NEXT_PUBLIC_CONVEX_URL',
      'CONVEX_DEPLOYMENT'
    ];

    requiredConvexVars.forEach(varName => {
      if (!process.env[varName]) {
        throw new Error(`Missing Convex environment variable: ${varName}`);
      }
      logger.info(`✓ ${varName} is configured`);
    });

    // Test Convex client initialization
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
    logger.info("✓ Convex client initialized successfully");

    logger.info("✓ Convex configuration verified");
  } catch (error) {
    logger.error("❌ Convex configuration test failed:", error);
    throw error;
  }

  logger.info("✓ All provider configurations verified successfully");
  return true;
} 