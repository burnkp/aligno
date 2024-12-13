import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#624CF5" },
        elements: {
          footer: { display: "none" },
          rootBox: {
            // Prevent auth content from flashing before the page loads
            "@keyframes fade-in": {
              from: { opacity: 0 },
              to: { opacity: 1 }
            },
            animation: "fade-in 0.5s ease-out",
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}; 