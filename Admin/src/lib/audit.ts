import { AuditLogModel } from "@/models/audit-log";

export async function recordAudit(entry: {
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  summary?: string;
}) {
  await AuditLogModel.create({
    actorId: entry.actorId ?? "system",
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    summary: entry.summary ?? "",
  });
}
