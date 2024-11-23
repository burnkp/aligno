"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const testQuery = useQuery(api.test.get);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Clerk Authentication Status:</h2>
            {!isUserLoaded ? (
              <p>Loading user...</p>
            ) : user ? (
              <p className="text-green-600">
                ✓ Clerk is working! Logged in as: {user.emailAddresses[0].emailAddress}
              </p>
            ) : (
              <p className="text-yellow-600">
                ⚠️ Not logged in. Please sign in to test authentication.
              </p>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Convex Connection Status:</h2>
            {testQuery === undefined ? (
              <p>Loading query...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-green-600">✓ {testQuery.message}</p>
                <p className="text-sm text-gray-600">Timestamp: {testQuery.timestamp}</p>
                {testQuery.user && (
                  <div className="text-sm text-gray-600">
                    <p>Authenticated as: {testQuery.user.email}</p>
                    <p>Name: {testQuery.user.name}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 