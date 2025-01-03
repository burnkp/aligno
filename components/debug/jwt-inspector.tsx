"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";

interface ClaimsDisplay {
  label: string;
  value: any;
}

interface JWTClaims {
  subject: string;
  tokenIdentifier: string;
  email: string;
  role: string;
  orgId: string;
  customClaims: Record<string, any>;
  authType: string;
  authProvider: string;
  rawToken: any;
}

interface QueryResult {
  status: string;
  message: string;
  claims: JWTClaims | null;
  error?: string;
}

export default function JWTInspector() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Always call useQuery, but return undefined if not signed in
  const claimsQuery = useQuery(api.debug.inspectJWTClaims);

  // Add error logging
  useEffect(() => {
    if (claimsQuery?.status === "error") {
      console.error("JWT Claims Query Error:", {
        status: claimsQuery.status,
        message: claimsQuery.message
      });
      setError(claimsQuery.message);
    }
  }, [claimsQuery]);

  const processedQuery = useMemo(() => {
    if (!isSignedIn) return undefined;
    return claimsQuery;
  }, [isSignedIn, claimsQuery]);

  if (!isUserLoaded) {
    return <LoadingState />;
  }

  if (!isSignedIn || !user) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600">Please sign in to inspect JWT claims.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Error Inspecting JWT</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="text-sm text-gray-600">
          <p className="mb-2">Debugging information:</p>
          <ul className="list-disc pl-5">
            <li>User ID: {user.id}</li>
            <li>Email: {user.emailAddresses[0]?.emailAddress}</li>
            <li>Auth Status: {isSignedIn ? "Signed In" : "Not Signed In"}</li>
          </ul>
        </div>
      </Card>
    );
  }

  if (processedQuery === undefined) {
    return <LoadingState />;
  }

  const toggleSection = (section: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderClaimsSection = (title: string, claims: ClaimsDisplay[]) => (
    <div className="mb-4">
      <Button
        variant="ghost"
        className="w-full justify-between mb-2"
        onClick={() => toggleSection(title)}
      >
        <span className="font-semibold">{title}</span>
        <span>{isExpanded[title] ? "▼" : "▶"}</span>
      </Button>
      
      {isExpanded[title] && (
        <div className="pl-4 space-y-2">
          {claims.map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                {typeof value === "object" 
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const jwtClaims = processedQuery.claims as JWTClaims;

  const sections = [
    {
      title: "Basic Claims",
      claims: [
        { label: "Subject", value: jwtClaims.subject },
        { label: "Email", value: jwtClaims.email },
        { label: "Token Identifier", value: jwtClaims.tokenIdentifier }
      ]
    },
    {
      title: "Role & Permissions",
      claims: [
        { label: "Role", value: jwtClaims.role },
        { label: "Organization ID", value: jwtClaims.orgId }
      ]
    },
    {
      title: "Auth Metadata",
      claims: [
        { label: "Auth Type", value: jwtClaims.authType },
        { label: "Auth Provider", value: jwtClaims.authProvider }
      ]
    },
    {
      title: "Custom Claims",
      claims: [
        { label: "Custom Claims", value: jwtClaims.customClaims }
      ]
    },
    {
      title: "Raw Token",
      claims: [
        { label: "Complete Token", value: jwtClaims.rawToken }
      ]
    }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">JWT Claims Inspector</h2>
          <p className="text-gray-600 mb-4">
            Inspect the current JWT claims from Clerk authentication.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.title}>
              {renderClaimsSection(section.title, section.claims)}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
} 