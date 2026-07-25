import { connectToDatabase } from "@/lib/db";
import { requireAdminRole } from "@/lib/rbac";
import { AuditLogModel } from "@/models/audit-log";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; action?: string }>;
}) {
  await requireAdminRole(["super_admin", "support_manager"]);
  const params = await searchParams;
  await connectToDatabase();
  const query: Record<string, unknown> = {};
  if (params.q) {
    query.$or = [
      { summary: { $regex: params.q, $options: "i" } },
      { entityType: { $regex: params.q, $options: "i" } },
    ];
  }
  if (params.action) {
    query.action = params.action;
  }
  const logs = await AuditLogModel.find(query).sort({ createdAt: -1 }).limit(100).lean();

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
      <h1 className="text-2xl font-semibold">Audit logs</h1>
      <form className="mt-5 grid gap-4 md:grid-cols-[1fr_220px_auto]">
        <input name="q" placeholder="Search summary or entity" defaultValue={params.q ?? ""} />
        <input name="action" placeholder="Filter by action" defaultValue={params.action ?? ""} />
        <button className="rounded-full border border-white/10 px-5 py-3 text-sm">Filter</button>
      </form>
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
