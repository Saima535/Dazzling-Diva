import { connectToDatabase } from "@/lib/db";
import { AuditLogModel } from "@/models/audit-log";

export default async function AuditLogsPage() {
  await connectToDatabase();
  const logs = await AuditLogModel.find().sort({ createdAt: -1 }).limit(100).lean();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Audit logs</h1>
      <div className="mt-5 space-y-3">
        {logs.map((log) => (
          <article key={String(log._id)} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="font-medium">{log.action}</p>
            <p className="mt-1 text-sm text-white/60">
              {log.entityType} · {log.summary || log.entityId}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
