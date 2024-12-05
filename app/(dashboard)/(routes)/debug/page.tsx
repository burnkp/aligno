"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const debug = useQuery(api.debug.checkEmailLogs);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Email Logs:</h3>
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                {JSON.stringify(debug, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 