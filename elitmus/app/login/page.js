"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup } from "./actions";
import { TAGLINE } from "@/lib/brand";
import { Wordmark } from "@/components/ui";
import { HeartIcon, QuoteIcon, ShieldIcon, VerifiedIcon } from "@/components/icons";

const FEATURES = [
  { Icon: HeartIcon, title: "5 likes a day", text: "Each one comes with a note, so every like means something." },
  { Icon: QuoteIcon, title: "Words before looks", text: "Search what people wrote. Prompts have no character limit." },
  { Icon: VerifiedIcon, title: "eLitmus verified", text: "An optional badge that shows you're a real candidate." },
  { Icon: ShieldIcon, title: "Safety is free", text: "Block or report anyone, any time. No paywall." },
];

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState(login, null);
  const [signupState, signupAction, signupPending] = useActionState(signup, null);

  const error = loginState?.error || signupState?.error;
  const pending = loginPending || signupPending;

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel (desktop only) */}
      <section className="relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-accent/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 size-[26rem] rounded-full bg-[#f2a65a]/20 blur-3xl" />

        <Wordmark className="relative text-3xl" />

        <div className="relative flex flex-col gap-10">
          <h2 className="font-display text-6xl leading-[1.02] font-medium tracking-tight xl:text-7xl">
            Fewer likes.
            <br />
            <em className="text-accent">Better</em> ones.
          </h2>
          <ul className="grid max-w-xl grid-cols-2 gap-x-8 gap-y-6">
            {FEATURES.map(({ Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-2">
                <Icon className="size-5 text-accent" />
                <p className="font-medium">{title}</p>
                <p className="text-sm leading-relaxed text-paper/60">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-paper/40">18+ only · Your city, never your exact location</p>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-6 py-12">
        <form className="flex w-full max-w-sm animate-rise flex-col gap-5">
          <Wordmark className="mb-6 text-3xl lg:hidden" />

          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-medium tracking-tight">Welcome</h1>
            <p className="text-[15px] text-ink-soft">{TAGLINE}</p>
          </div>

          <label className="flex flex-col gap-2">
            <span className="label">Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required className="field" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="label">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="field"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-1">
            <button formAction={loginAction} disabled={pending} className="btn btn-primary py-3.5">
              {loginPending ? "Logging in…" : "Log in"}
            </button>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" />
              new here?
              <span className="h-px flex-1 bg-line" />
            </div>
            <button formAction={signupAction} disabled={pending} className="btn btn-outline py-3.5">
              {signupPending ? "Creating account…" : "Create an account"}
            </button>
          </div>

          <p className="text-center text-xs leading-relaxed text-muted">
            18+ only. By continuing you agree to our{" "}
            <Link href="/legal" className="underline underline-offset-2 hover:text-ink">
              Terms &amp; Privacy
            </Link>
            .
          </p>
        </form>
      </section>
    </main>
  );
}
