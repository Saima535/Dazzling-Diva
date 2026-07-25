import Link from "next/link";

import { requireAdmin } from "@/lib/auth";

import { logoutAction } from "./actions";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Products", "/dashboard/products"],
  ["Categories", "/dashboard/categories"],
  ["Collections", "/dashboard/collections"],
  ["Homepage", "/dashboard/homepage"],
  ["Orders", "/dashboard/orders"],
  ["Settings", "/dashboard/settings"],
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-white/10 bg-black/30 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Dazzling Diva</p>
        <h2 className="mt-4 text-2xl font-semibold">Control room</h2>
        <p className="mt-2 text-sm text-white/60">{admin.email}</p>
        <nav className="mt-8 space-y-2">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="block rounded-2xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/8"
            >
              {label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-8">
          <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
            Sign out
          </button>
        </form>
      </aside>
      <main className="p-6 lg:p-10">{children}</main>
    </div>
  );
}
