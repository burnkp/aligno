"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsAuthenticated(!!isSignedIn);
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStatus = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthStatus must be used within an AuthProvider");
  }
  return context;
}; 