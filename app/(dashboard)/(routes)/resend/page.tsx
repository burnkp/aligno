"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface EmailLog {
  _id: Id<any>;
  email: string;
  teamId: string;
  status: string;
  error?: string;
  details?: string;
  timestamp: string;
  environment: string;
}

export default function ResendLogsPage() {
  const rawLogs = useQuery(api.email.getLogs);
  const logs = rawLogs?.map((log: any) => ({
    _id: log._id,
    email: log.email || "",
    teamId: log.teamId || "",
    status: log.status || "unknown",
    error: log.error,
    details: log.details,
    timestamp: log.timestamp || new Date().toISOString(),
    environment: log.environment || "development",
  })) as EmailLog[] | undefined;

  if (!logs || logs.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Email Logs</h1>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">No email logs found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Email Logs</h1>
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log._id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{log.email}</span>
                <Badge 
                  variant={log.status === "sent" ? "default" : "destructive"}
                  className={log.status === "sent" ? "bg-green-500" : undefined}
                >
                  {log.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {format(new Date(log.timestamp), "PPpp")}
              </div>
              {log.error && (
                <div className="text-red-500 text-sm">
                  Error: {log.error}
                </div>
              )}
              {log.details && (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(JSON.parse(log.details), null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 