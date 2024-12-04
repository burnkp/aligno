"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface InvitationLog {
  _id: Id<"invitationLogs">;
  email: string;
  status: string;
  error?: string;
  details?: string;
  timestamp: string;
  environment: string;
}

export default function InvitationLogsPage() {
  const logs = useQuery(api.email.getLogs);
  
  console.log("Logs from query:", logs); // Debug log

  if (!logs || logs.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Invitation Logs</h1>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">No invitation logs found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Invitation Logs</h1>
      <div className="space-y-4">
        {logs.map((log: InvitationLog) => (
          <Card key={log._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {log.email} - {log.status}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(new Date(log.timestamp), "PPpp")}
              </div>
            </CardHeader>
            <CardContent>
              {log.error && (
                <div className="text-red-500 mb-2">Error: {log.error}</div>
              )}
              {log.details && (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {log.details}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 