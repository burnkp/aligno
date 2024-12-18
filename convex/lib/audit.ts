import { DatabaseWriter } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function logAuditEvent(
  db: DatabaseWriter,
  {
    userId,
    action,
    resource,
    details,
    organizationId,
  }: {
    userId: string;
    action: string;
    resource: string;
    details: any;
    organizationId?: Id<"organizations">;
  }
) {
  await db.insert("auditLogs", {
    userId,
    action,
    resource,
    details,
    organizationId,
    timestamp: new Date().toISOString(),
  });
} 