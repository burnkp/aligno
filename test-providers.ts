import { ConvexReactClient } from "convex/react";
import logger from "@/utils/logger";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

async function testClerkConfiguration(): Promise<TestResult> {
  try {
    logger.info("Testing Clerk configuration...");
    const requiredClerkVars = [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'CLERK_SECRET_KEY',
      'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'
    ];

    const missingVars = requiredClerkVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      return {
        success: false,
        message: `Missing Clerk environment variables: ${missingVars.join(", ")}`,
      };
    }

    // Validate URL formats
    const urlVars = [
      'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'
    ];

    for (const varName of urlVars) {
      const url = process.env[varName];
      if (!url?.startsWith('/')) {
        return {
          success: false,
          message: `Invalid URL format for ${varName}: URLs should start with /`,
          details: { varName, value: url }
        };
      }
    }

    return {
      success: true,
      message: "Clerk configuration verified successfully",
    };
  } catch (error) {
    logger.error("Clerk configuration test failed:", error);
    return {
      success: false,
      message: "Clerk configuration test failed",
      details: error
    };
  }
}

async function testConvexConfiguration(): Promise<TestResult> {
  try {
    logger.info("Testing Convex configuration...");
    const requiredConvexVars = [
      'NEXT_PUBLIC_CONVEX_URL',
      'CONVEX_DEPLOYMENT'
    ];

    const missingVars = requiredConvexVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      return {
        success: false,
        message: `Missing Convex environment variables: ${missingVars.join(", ")}`,
      };
    }

    // Validate Convex URL format
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl?.startsWith('https://')) {
      return {
        success: false,
        message: "Invalid Convex URL format: URL should start with https://",
        details: { value: convexUrl }
      };
    }

    // Test Convex client initialization
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    return {
      success: true,
      message: "Convex configuration verified successfully",
    };
  } catch (error) {
    logger.error("Convex configuration test failed:", error);
    return {
      success: false,
      message: "Convex configuration test failed",
      details: error
    };
  }
}

export async function testProviderConfiguration(): Promise<TestResult> {
  logger.info("Starting provider configuration test");

  try {
    // Test Clerk configuration
    const clerkResult = await testClerkConfiguration();
    if (!clerkResult.success) {
      return clerkResult;
    }

    // Test Convex configuration
    const convexResult = await testConvexConfiguration();
    if (!convexResult.success) {
      return convexResult;
    }

    logger.info("✓ All provider configurations verified successfully");
    return {
      success: true,
      message: "All provider configurations verified successfully"
    };
  } catch (error) {
    logger.error("Provider configuration test failed:", error);
    return {
      success: false,
      message: "Provider configuration test failed",
      details: error
    };
  }
} 