"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeamActivityLogProps {
  teamId: Id<"teams">;
}

export function TeamActivityLog({ teamId }: TeamActivityLogProps) {
  const logs = useQuery(api.auditLogs.getTeamLogs, { teamId });

  if (!logs) {
    return (
      <div className="flex items-center justify-center h-24">
        <p>Loading...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-24">
        <p className="text-muted-foreground">No activity yet</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log._id}>
            <TableCell>
              <Badge
                variant={
                  log.action === "create"
                    ? "default"
                    : log.action === "update"
                    ? "secondary"
                    : "destructive"
                }
              >
                {log.action}
              </Badge>
            </TableCell>
            <TableCell>{log.userId}</TableCell>
            <TableCell>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </TableCell>
            <TableCell>
              {new Date(log.timestamp).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 