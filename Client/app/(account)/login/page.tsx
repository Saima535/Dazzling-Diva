import { AccountAuthForm } from "@/src/components/account-auth-form";

export default function AccountLoginPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <h1 className="text-4xl font-semibold">Customer login</h1>
      <p className="mt-6 text-sm text-white/70">
        Sign in to review your saved account details, wishlist, and order history.
      </p>
      <AccountAuthForm mode="login" />
    </main>
  );
}
