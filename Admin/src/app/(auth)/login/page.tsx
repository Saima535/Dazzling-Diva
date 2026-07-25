import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-white/50">Dazzling Diva</p>
        <h1 className="mt-3 text-3xl font-semibold">Admin login</h1>
        <p className="mt-3 text-sm text-white/70">
          Sign in with a super admin or delegated operator account.
        </p>
        <form action={loginAction} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/70" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" required />
          </div>
          <button className="w-full rounded-full bg-[var(--brand-strong)] px-5 py-3 font-medium text-white">
            Sign in
          </button>
        </form>
        {params.error ? (
          <p className="mt-4 text-sm text-red-300">Invalid email or password.</p>
        ) : null}
      </div>
    </main>
  );
}
