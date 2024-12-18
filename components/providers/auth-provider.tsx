import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
const logger = require("../../logger");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Log initialization of AuthProvider
    logger.info("Initializing AuthProvider");
    
    // Verify all required Clerk environment variables
    const requiredVars = [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
      'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      const error = `Missing required Clerk environment variables: ${missingVars.join(", ")}`;
      logger.error(error);
      throw new Error(error);
    }

    logger.info("AuthProvider: All required environment variables verified");
    logger.info("AuthProvider: Sign-in URL configured as:", process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);
    logger.info("AuthProvider: Sign-up URL configured as:", process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL);
  }, []);

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        variables: { colorPrimary: "#624CF5" },
        elements: {
          footer: { display: "none" },
          rootBox: {
            "@keyframes fade-in": {
              from: { opacity: 0 },
              to: { opacity: 1 }
            },
            animation: "fade-in 0.5s ease-out",
          }
        }
      }}
      // Configure Clerk with environment variables
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      // Add debug mode in development
      {...(process.env.NODE_ENV === "development" && { debug: true })}
    >
      {children}
    </ClerkProvider>
  );
}; 