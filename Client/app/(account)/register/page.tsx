import { AccountAuthForm } from "@/src/components/account-auth-form";

export default function AccountRegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Create account</h1>
      <p className="mt-6 text-sm text-white/70">
        Register once to keep your order history tied to your profile.
      </p>
      <AccountAuthForm mode="register" />
    </main>
  );
}
