"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProfile } from "./actions";
import { CITIES, GENDERS, INTERESTED_IN, INTENTS } from "@/lib/options";
import SelectField from "@/components/select-field";
import ChoiceGroup from "@/components/choice-group";
import { PageHeader, Stepper, Wordmark } from "@/components/ui";
import { ArrowRightIcon, VerifiedIcon } from "@/components/icons";

const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c }));

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createProfile, null);

  return (
    <main className="page-narrow">
      <Wordmark className="mb-8 block text-2xl" />
      <Stepper current={0} linked={false} />
      <PageHeader
        title="Let's start with the basics"
        subtitle="This decides who you'll see and who sees you. You can change it later, except your birthday."
      />

      <form action={formAction} className="card flex animate-rise flex-col gap-6 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="label">First name</span>
            <input name="name" required maxLength={50} autoComplete="given-name" className="field" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="label">Date of birth</span>
            <input name="birthdate" type="date" required className="field" />
            <span className="text-xs text-muted">18+ only. Others only see your age.</span>
          </label>
        </div>

        <ChoiceGroup label="I am a" name="gender" options={GENDERS} />
        <ChoiceGroup label="Interested in" name="interested_in" options={INTERESTED_IN} />
        <SelectField label="City" name="city" options={CITY_OPTIONS} />
        <ChoiceGroup label="Looking for" name="intent" options={INTENTS} columns={2} />

        {/* Opt-in only: DPDP requires explicit consent before using eLitmus data */}
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-sky-soft/50 p-4 transition has-[:checked]:border-sky/40 has-[:checked]:bg-sky-soft">
          <input type="checkbox" name="elitmus_consent" className="mt-1 size-4 accent-[var(--color-sky)]" />
          <span className="flex flex-col gap-1 text-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <VerifiedIcon className="size-4" /> Verify me with eLitmus
              <span className="font-normal text-muted">(optional)</span>
            </span>
            <span className="leading-relaxed text-ink-soft">
              We check whether this email is in eLitmus&apos;s candidate records and, if so, add a
              Verified badge. Nothing else is imported.
            </span>
          </span>
        </label>

        {state?.error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button disabled={pending} className="btn btn-primary py-3.5">
          {pending ? "Saving…" : "Continue"}
          {!pending && <ArrowRightIcon className="size-4" />}
        </button>

        <p className="text-center text-xs text-muted">
          See our{" "}
          <Link href="/legal" className="underline underline-offset-2 hover:text-ink">
            Terms &amp; Privacy
          </Link>
        </p>
      </form>
    </main>
  );
}
