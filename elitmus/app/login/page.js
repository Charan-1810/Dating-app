"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup } from "./actions";
import { APP_NAME, TAGLINE } from "@/lib/brand";

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(login, null);
  const [signupState, signupAction, signupPending] = useActionState(signup, null);

  const error = loginState?.error || signupState?.error;
  const pending = loginPending || signupPending;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form className="flex w-full max-w-sm flex-col gap-3">
        <h1 className="text-3xl font-semibold">{APP_NAME}</h1>
        <p className="text-gray-600">{TAGLINE}</p>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          required
          minLength={8}
          className="rounded border p-2"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          formAction={loginAction}
          disabled={pending}
          className="rounded bg-black p-2 text-white disabled:opacity-50"
        >
          Log in
        </button>
        <button
          formAction={signupAction}
          disabled={pending}
          className="rounded border p-2 disabled:opacity-50"
        >
          Create account
        </button>

        <p className="text-center text-xs text-gray-500">
          18+ only. By creating an account you agree to our{" "}
          <Link href="/legal" className="underline">
            Terms &amp; Privacy
          </Link>
          .
        </p>
      </form>
    </main>
  );
}