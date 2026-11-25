import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ALWAYS_FREE, PREMIUM_FEATURES, PREMIUM_PRICE, formatDateIST, getPremium } from "@/lib/premium";
import { PageHeader, Spinner } from "@/components/ui";
import { HeartIcon, ShieldIcon, SparklesIcon } from "@/components/icons";
import { CancelButton, Checkout, Included } from "./checkout";

export const metadata = { title: "Premium" };

export default function PremiumPage() {
  return (
    <main className="page-narrow">
      <PageHeader
        eyebrow="Premium"
        title="Understand people, don't just see more of them"
        subtitle="Premium adds depth. It never adds extra likes or boosts, and everything that keeps you safe stays free."
      />
      <Suspense fallback={<Spinner />}>
        <PremiumContent />
      </Suspense>
    </main>
  );
}

async function PremiumContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const premium = await getPremium(supabase, user.id);

  return (
    <div className="flex flex-col gap-5">
      {/* Plan card */}
      <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-paper shadow-lift sm:p-8">
        <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-display text-3xl">
                <SparklesIcon className="size-6 text-accent" /> Premium
              </p>
              <p className="mt-1 text-sm text-paper/60">For people who want to know why, not just who</p>
            </div>
            {premium.active ? (
              <span className="chip bg-accent text-white">Active</span>
            ) : (
              <p className="text-right">
                <span className="font-display text-4xl">₹{PREMIUM_PRICE}</span>
                <span className="block text-xs text-paper/60">per month</span>
              </p>
            )}
          </div>

          <ul className="flex flex-col gap-4">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f.title} className="flex gap-3">
                <SparklesIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  <span className="font-medium">{f.title}</span>
                  <span className="block text-sm leading-relaxed text-paper/65">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>

          {premium.active ? (
            <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-4">
              <p className="text-sm">
                You&apos;re on Premium until <span className="font-medium">{formatDateIST(premium.until)}</span>.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/browse" className="btn bg-paper text-ink hover:bg-paper/90">
                  Try the personality filter
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-paper p-1 text-ink">
              <Checkout />
            </div>
          )}
        </div>
      </section>

      {premium.active && (
        <div className="flex justify-center">
          <CancelButton />
        </div>
      )}

      {/* The promise: what's never paywalled */}
      <section className="card p-6">
        <p className="flex items-center gap-2 font-display text-xl">
          <ShieldIcon className="size-5 text-sage" /> Always free, for everyone
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Other apps charge to see who liked you, or for safety tools. We never will.
        </p>
        <ul className="mt-4 grid gap-2.5 text-[15px] sm:grid-cols-2">
          {ALWAYS_FREE.map((item) => (
            <Included key={item}>{item}</Included>
          ))}
        </ul>
      </section>

      {/* What we'll never sell */}
      <section className="flex items-start gap-3 rounded-3xl bg-sand/70 p-5 text-sm leading-relaxed text-ink-soft">
        <HeartIcon className="mt-0.5 size-5 shrink-0 text-accent" />
        <p>
          <span className="font-medium text-ink">What we&apos;ll never sell:</span> extra likes, boosts, or a spot at the
          top of search. Those reward money, not intention, and they&apos;d make your 5 daily likes mean less.
        </p>
      </section>
    </div>
  );
}
