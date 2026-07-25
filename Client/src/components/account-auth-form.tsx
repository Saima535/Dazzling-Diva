"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function AccountAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload =
          mode === "register"
            ? {
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                phone: String(formData.get("phone") ?? ""),
              }
            : {
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
              };

        startTransition(async () => {
          setError("");
          const response = await fetch(`/api/auth/${mode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = await response.json();

          if (!response.ok || !result.success) {
            setError(result.error ?? "Unable to continue.");
            return;
          }

          router.push("/account");
          router.refresh();
        });
      }}
    >
      {mode === "register" ? <input name="name" placeholder="Full name" required /> : null}
      {mode === "register" ? <input name="phone" placeholder="Phone" /> : null}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black" disabled={pending}>
        {pending ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
